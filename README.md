# Visual Product Matcher

A sophisticated web application that helps users find visually similar products using AI-powered image analysis with the Imagga API.

## Features

### Core Functionality
- **Image Upload**: Support for both file upload (drag & drop) and image URL input
- **AI-Powered Analysis**: Uses Imagga API to extract tags and analyze image content
- **Smart Matching**: Advanced similarity algorithm that matches products based on visual tags
- **Advanced Filtering**: Filter results by similarity score, category, and number of results
- **Product Database**: Comprehensive catalog of 50+ products with detailed metadata

### User Experience
- **Mobile-First Design**: Fully responsive interface optimized for all devices
- **Real-Time Feedback**: Loading states and progress indicators throughout the process
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Interactive UI**: Smooth animations, hover effects, and micro-interactions

## Technical Approach

### Architecture
The application follows a modular, component-based architecture:

```
src/
├── components/          # Reusable UI components
│   ├── ImageUpload.tsx  # File/URL upload interface
│   ├── ProductCard.tsx  # Individual product display
│   ├── ProductGrid.tsx  # Product results grid with filtering
│   └── TagsDisplay.tsx  # Extracted tags visualization
├── services/            # External API integrations
│   └── imagga.ts       # Imagga API service
├── utils/              # Business logic utilities
│   └── similarity.ts   # Product matching algorithm
├── data/               # Static data
│   └── products.ts     # Product database
└── types/              # TypeScript definitions
    └── index.ts        # Shared type definitions
```

### Image Analysis Process
1. **Image Input**: User uploads an image file or provides a URL
2. **API Analysis**: Image is sent to Imagga API for tag extraction
3. **Tag Processing**: Extracted tags are processed and normalized
4. **Similarity Matching**: Custom algorithm compares image tags with product metadata
5. **Results Display**: Products are ranked by similarity score and displayed

### Similarity Algorithm
The matching algorithm considers multiple factors:
- **Exact Tag Matches**: Direct matches between image tags and product tags
- **Partial Matches**: Substring matching for related terms
- **Category Matching**: Bonus scoring for category alignment
- **Confidence Weighting**: Higher confidence tags have more influence
- **Normalization**: Scores are normalized to 0-100 scale

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development and optimized builds
- **Icons**: Lucide React for consistent iconography
- **API Integration**: Imagga API for image analysis
- **State Management**: React hooks for local component state

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Imagga API credentials (already configured)

### Installation
```bash
npm install
npm run dev
```

### Environment Setup
The application uses Imagga API for image analysis. API credentials are pre-configured in the `.env` file.

## Usage

1. **Upload Image**: Drag and drop an image file or paste an image URL
2. **Analysis**: The app automatically analyzes the image and extracts relevant tags
3. **View Results**: Browse similar products ranked by similarity score
4. **Filter Results**: Use the filtering options to refine your search
5. **Explore Products**: Click through product cards to see detailed information

## Performance Considerations

- **Image Optimization**: Uploaded images are displayed efficiently
- **API Rate Limiting**: Requests are handled with proper error management
- **Responsive Loading**: Progressive loading states for better user experience
- **Memory Management**: Proper cleanup of blob URLs and event listeners

## Future Enhancements

- Advanced filtering options (price range, ratings, brand)
- Product comparison functionality
- User accounts and saved searches
- Enhanced similarity algorithm with visual features
- Integration with e-commerce platforms
- Advanced image preprocessing and optimization