import { Product, ImaggaTag, ProductMatch } from "../types";

export class SimilarityCalculator {
  static normalizeImaggaTag(tag: any): string {
    if (typeof tag === "string") return tag.toLowerCase();
    if (
      tag &&
      typeof tag === "object" &&
      "en" in tag &&
      typeof tag.en === "string"
    )
      return tag.en.toLowerCase();
    return String(tag).toLowerCase();
  }

  static calculateSimilarity(imageTags: ImaggaTag[], product: Product): number {
    const imageTagsNormalized = imageTags.map((tag) => ({
      tag: SimilarityCalculator.normalizeImaggaTag(tag.tag),
      confidence: tag.confidence,
    }));

    const productTagsNormalized = product.tags.map((tag) =>
      typeof tag === "string" ? tag.toLowerCase() : String(tag)
    );

    let totalScore = 0;
    let matchCount = 0;

    // Check for exact tag matches
    for (const imageTag of imageTagsNormalized) {
      for (const productTag of productTagsNormalized) {
        if (imageTag.tag === productTag) {
          totalScore += imageTag.confidence;
          matchCount++;
        }
        // Partial matches (substring)
        else if (
          imageTag.tag.includes(productTag) ||
          productTag.includes(imageTag.tag)
        ) {
          totalScore += imageTag.confidence * 0.7;
          matchCount++;
        }
      }
    }

    // Category bonus
    const categoryMatch = imageTagsNormalized.some(
      (tag) =>
        product.category.toLowerCase().includes(tag.tag) ||
        tag.tag.includes(product.category.toLowerCase())
    );

    if (categoryMatch) {
      totalScore += 15;
      matchCount++;
    }

    // Subcategory bonus
    const subcategoryMatch = imageTagsNormalized.some(
      (tag) =>
        product.subcategory.toLowerCase().includes(tag.tag) ||
        tag.tag.includes(product.subcategory.toLowerCase())
    );

    if (subcategoryMatch) {
      totalScore += 10;
      matchCount++;
    }

    // Normalize score
    return matchCount > 0
      ? Math.min(100, totalScore / Math.max(1, matchCount))
      : 0;
  }

  static findSimilarProducts(
    imageTags: ImaggaTag[],
    products: Product[],
    minScore: number = 0
  ): ProductMatch[] {
    const matches: ProductMatch[] = [];

    for (const product of products) {
      const score = this.calculateSimilarity(imageTags, product);

      if (score >= minScore) {
        const matchingTags = this.getMatchingTags(imageTags, product);
        matches.push({
          product,
          score: Math.round(score * 100) / 100,
          matchingTags,
        });
      }
    }

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }

  private static getMatchingTags(
    imageTags: ImaggaTag[],
    product: Product
  ): string[] {
    const imageTagsNormalized = imageTags.map((tag) =>
      SimilarityCalculator.normalizeImaggaTag(tag.tag)
    );
    const productTagsNormalized = product.tags.map((tag) =>
      typeof tag === "string" ? tag.toLowerCase() : String(tag)
    );

    const matches: string[] = [];

    for (const imageTag of imageTagsNormalized) {
      for (const productTag of productTagsNormalized) {
        if (
          imageTag === productTag ||
          imageTag.includes(productTag) ||
          productTag.includes(imageTag)
        ) {
          if (!matches.includes(productTag)) {
            matches.push(productTag);
          }
        }
      }
    }

    return matches;
  }
}
