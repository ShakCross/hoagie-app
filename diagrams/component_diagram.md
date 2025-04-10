# Frontend Component Diagram

## Application Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          FRONTEND ARCHITECTURE                           │
│                                                                          │
├─────────────────┐  ┌─────────────────┐  ┌────────────────────────────────┤
│                 │  │                 │  │                                │
│   App Container │  │   Navigation    │  │           Screens              │
│                 │  │                 │  │                                │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌─────────────────────────┐  │
│  │           │  │  │  │           │  │  │  │                         │  │
│  │  Provider │  │  │  │  Stack    │  │  │  │  LoginScreen           │  │
│  │  Context  │◄─┼──┼──┼─►Navigator│◄─┼──┼──┼─►RegisterScreen        │  │
│  │           │  │  │  │           │  │  │  │  HoagieListScreen      │  │
│  └───────────┘  │  │  └───────────┘  │  │  │  HoagieDetailsScreen   │  │
│                 │  │                 │  │  │  CreateHoagieScreen    │  │
│                 │  │                 │  │  │  EditHoagieScreen      │  │
│                 │  │                 │  │  │                         │  │
└─────┬───────────┘  └────────┬────────┘  └──────────┬──────────────────┘  │
      │                       │                      │                     │
      ▼                       ▼                      ▼                     │
┌─────────────────┐  ┌─────────────────┐  ┌────────────────────────────────┤
│                 │  │                 │  │                                │
│    Services     │  │    Hooks        │  │         Components             │
│                 │  │                 │  │                                │
│  ┌───────────┐  │  │  ┌───────────┐  │  │  ┌─────────────────────────┐  │
│  │ API       │  │  │  │ useAuth   │  │  │  │ HoagieCard             │  │
│  │ Service   │◄─┼──┼──┼─►Hook     │  │  │  │ CommentSection         │  │
│  │           │  │  │  │           │  │  │  │ CollaboratorsList      │  │
│  └───┬───────┘  │  │  └───────────┘  │  │  │ HoagieForm             │  │
│      │          │  │                 │  │  │ LoadingSpinner         │  │
│      ▼          │  │                 │  │  │ ErrorMessage           │  │
│  ┌───────────┐  │  │                 │  │  │                         │  │
│  │ Auth      │  │  │                 │  │  └─────────────────────────┘  │
│  │ Service   │  │  │                 │  │                                │
│  │           │  │  │                 │  │  ┌─────────────────────────┐  │
│  └───────────┘  │  │                 │  │  │       UI Components     │  │
│                 │  │                 │  │  │                         │  │
│  ┌───────────┐  │  │                 │  │  │ Button                 │  │
│  │ Hoagie    │  │  │                 │  │  │ Card                   │  │
│  │ Service   │  │  │                 │  │  │ HamburgerLogo          │  │
│  │           │  │  │                 │  │  │ SplashScreen           │  │
│  └───────────┘  │  │                 │  │  │                         │  │
│                 │  │                 │  │  └─────────────────────────┘  │
│  ┌───────────┐  │  │                 │  │                                │
│  │ Comment   │  │  │                 │  │                                │
│  │ Service   │  │  │                 │  │                                │
│  │           │  │  │                 │  │                                │
│  └───────────┘  │  │                 │  │                                │
│                 │  │                 │  │                                │
└─────────────────┘  └─────────────────┘  └────────────────────────────────┘
      │                                                    ▲                
      │                                                    │                
      ▼                                                    │                
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                               Theme System                                │
│                                                                           │
│  ┌───────────────┐   ┌────────────────┐   ┌────────────────┐   ┌─────────┐
│  │               │   │                │   │                │   │         │
│  │    COLORS     │   │   TYPOGRAPHY   │   │    SPACING    │   │ SHADOWS │
│  │   (colors.ts) │   │ (typography.ts)│   │  (spacing.ts) │   │         │
│  │               │   │                │   │                │   │         │
│  └───────────────┘   └────────────────┘   └────────────────┘   └─────────┘
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Application Core

#### App Container
- **AuthProvider**: Manages authentication state and provides auth context
- **SafeAreaProvider**: Ensures content is displayed in the safe area of the device
- **NavigationContainer**: Root container for the navigation system
- **ThemeProvider**: Provides the McDonald's theme to the entire application

#### Navigation
- **AuthStack**: Stack navigator for authentication screens (Login/Register)
- **AppStack**: Stack navigator for main app screens (List/Details/Create/Edit)
- **RootNavigator**: Switches between auth and app stacks based on login state

### Services

#### API Service
- Creates and configures the Axios instance
- Sets up base URL and headers
- Handles global request/response interceptors

#### Auth Service
- Handles user registration and login
- Communicates with the backend auth endpoints

#### Hoagie Service
- Manages CRUD operations for hoagies
- Handles pagination and filtering
- Manages collaborator operations

#### Comment Service
- Fetches, creates, updates, and deletes comments
- Handles pagination for comments

### Hooks

#### useAuth Hook
- Provides authentication state to components
- Exposes login, register, and logout functions
- Tracks current user information

### Screens

#### Authentication Screens
- **LoginScreen**: User login form with McDonald's themed UI
- **RegisterScreen**: New user registration form with McDonald's themed UI

#### Main Screens
- **HoagieListScreen**: Displays paginated list of hoagies with optimized mobile layout
- **HoagieDetailsScreen**: Shows detailed view of a single hoagie with optimized mobile navigation
- **CreateHoagieScreen**: Form for creating new hoagies with consistent UI elements
- **EditHoagieScreen**: Form for editing existing hoagies with consistent UI elements

### Reusable Components

#### Business Components
- **HoagieCard**: Card component for displaying hoagie in list
- **CommentSection**: Display and add comments to a hoagie
- **CollaboratorsList**: Show and manage hoagie collaborators
- **HoagieForm**: Reusable form for creating/editing hoagies
- **LoadingSpinner**: Loading indicator component
- **ErrorMessage**: Standardized error display

#### UI Components
- **Button**: Reusable button component with variants (primary, secondary, outline, text)
- **Card**: Styled card component with consistent McDonald's theme
- **HamburgerLogo**: McDonald's-themed logo component
- **SplashScreen**: App loading screen with themed animation

### Theme System

#### Colors (colors.ts)
- Primary, secondary color palette based on McDonald's branding
- Semantic color definitions (text, background, error, etc.)
- Consistent color usage across the application

#### Typography (typography.ts)
- Font definitions (Poppins family)
- Text styles (headings, body, button, etc.)
- Mobile-optimized font sizes

#### Spacing (spacing.ts)
- Consistent spacing units
- Layout constants (padding, margin, etc.)
- Special spacing values (button height, input height, etc.)

#### Shadows (shadows.ts)
- Cross-platform shadow definitions
- Various elevation levels

## Data Flow

1. **Authentication Flow**:
   ```
   LoginScreen → AuthService → API → useAuth Hook → App Navigation
   ```

2. **Hoagie Creation Flow**:
   ```
   CreateHoagieScreen → HoagieForm → HoagieService → API → HoagieListScreen
   ```

3. **Comment Flow**:
   ```
   CommentSection → CommentService → API → CommentSection (updated)
   ```

## State Management

The application uses a combination of:

1. **React Context** for global state (authentication)
2. **useState** for component-level state
3. **useEffect** for side effects and data fetching
4. **useFocusEffect** for screen-specific data refreshing

## Styling Approach

The application uses a comprehensive theming system:
- **Theme Constants**: Centralized definition of colors, typography, spacing, and shadows
- **Component-specific StyleSheet**: Local styles that leverage theme constants
- **Responsive Design**: Adaptable layouts for different screen sizes
- **Consistent UI Elements**: Reusable UI components with standard styling
- **McDonald's Branding**: Consistent application of the McDonald's color scheme and design elements

## Mobile-specific Optimizations

1. **Touch Targets**: Minimum 48px height for interactive elements
2. **Text Sizing**: Optimized font sizes (11-16px) for mobile readability 
3. **Button Variants**: Different button styles for different contexts
4. **Loading States**: Visible feedback during async operations
5. **Responsive Layout**: Adapts to device orientation and screen size

## Error Handling Strategy

1. Try/catch blocks in services for API calls
2. Error state management in components
3. User-friendly error messages
4. Retry mechanisms for network failures 