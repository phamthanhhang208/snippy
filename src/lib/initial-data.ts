"use client";

import type { Folder, Snippet, Tag } from "./types";

export const initialData: {
    folders: Folder[];
    snippets: Snippet[];
    tags: Tag[];
} = {
    folders: [
        {
            id: "folder-1",
            name: "Personal",
            parentId: null,
            color: "blue",
        },
        {
            id: "folder-2",
            name: "Temp",
            parentId: null,
            color: "yellow",
        },
        {
            id: "folder-3",
            name: "Utility",
            parentId: null,
            color: "orange",
        },
        {
            id: "folder-4",
            name: "Work",
            parentId: null,
            color: "red",
        },
    ],
    snippets: [
        {
            id: "snippet-1",
            title: "React Button Component",
            description: "Simple button component with variants",
            code: `import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  const baseStyles = 'rounded font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={\`\${baseStyles} \${variantStyles[variant]} \${sizeStyles[size]} \${disabledStyles}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`,
            language: "typescript",
            notes: "Reusable button component with different variants and sizes",
            readme: `# React Button Component

A flexible and reusable button component for React applications.

## Features
- Multiple variants: primary, secondary, outline
- Different sizes: small, medium, large
- Disabled state
- TypeScript support

## Usage
\`\`\`jsx
import { Button } from './Button';

function App() {
  return (
    <div>
      <Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
      
      <Button variant="outline" disabled>
        Disabled Button
      </Button>
    </div>
  );
}
\`\`\``,
            tags: ["tag-6"],
            folderId: "folder-1",
            createdAt: "2023-01-15T12:00:00.000Z",
            updatedAt: "2023-01-15T12:00:00.000Z",
            isFavorite: false,
            isPublic: true,
        },
        {
            id: "snippet-2",
            title: "CSS Grid Layout",
            description: "Responsive grid layout with CSS Grid",
            code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}`,
            language: "css",
            notes: "Responsive grid layout using CSS Grid with hover effects",
            readme: `# Responsive CSS Grid Layout

A modern responsive grid layout using CSS Grid.

## Features
- Auto-adjusting columns based on available space
- Minimum column width of 250px
- Responsive breakpoints for different screen sizes
- Hover effects for grid items

## Usage
Add the HTML structure:
\`\`\`html
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <!-- Add more items as needed -->
</div>
\`\`\`

Then include the CSS in your stylesheet.`,
            tags: ["tag-5"],
            folderId: "folder-2",
            createdAt: "2023-02-20T14:30:00.000Z",
            updatedAt: "2023-02-20T14:30:00.000Z",
            isFavorite: true,
            isPublic: true,
        },
        {
            id: "snippet-3",
            title: "JavaScript Array Methods",
            description: "Common array manipulation methods",
            code: `// Sample array
const fruits = ['apple', 'banana', 'orange', 'mango', 'kiwi'];

// 1. Map - Create a new array by transforming each element
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('Mapped array:', upperFruits);

// 2. Filter - Create a new array with elements that pass a test
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log('Filtered array:', longFruits);

// 3. Reduce - Reduce array to a single value
const fruitString = fruits.reduce((acc, fruit, index) => {
  return index === 0 ? fruit : acc + ', ' + fruit;
}, '');
console.log('Reduced to string:', fruitString);

// 4. Find - Return the first element that passes a test
const firstLongFruit = fruits.find(fruit => fruit.length > 5);
console.log('First long fruit:', firstLongFruit);

// 5. Sort - Sort the array
const sortedFruits = [...fruits].sort();
console.log('Sorted array:', sortedFruits);

// 6. Some - Check if at least one element passes a test
const hasShortFruit = fruits.some(fruit => fruit.length < 5);
console.log('Has short fruit:', hasShortFruit);

// 7. Every - Check if all elements pass a test
const allShortFruits = fruits.every(fruit => fruit.length < 10);
console.log('All fruits are short:', allShortFruits);`,
            language: "javascript",
            notes: "Common JavaScript array methods with examples",
            isFavorite: false,
            isPublic: true,
            readme: `# JavaScript Array Methods

A collection of common JavaScript array methods with examples.

## Methods Covered
1. **map()** - Creates a new array with the results of calling a function on every element
2. **filter()** - Creates a new array with elements that pass a test
3. **reduce()** - Reduces an array to a single value
4. **find()** - Returns the first element that passes a test
5. **sort()** - Sorts the elements of an array
6. **some()** - Checks if at least one element passes a test
7. **every()** - Checks if all elements pass a test

## Notes
- Most of these methods don't modify the original array
- For sorting objects or by custom criteria, provide a compare function to sort()
- The reduce() method is very powerful for transforming arrays into different data structures`,
            tags: ["tag-5"],
            folderId: "folder-3",
            createdAt: "2023-03-10T09:15:00.000Z",
            updatedAt: "2023-03-10T09:15:00.000Z",
        },
        {
            id: "snippet-4",
            title: "React useEffect Hook",
            description: "Examples of React useEffect hook",
            code: `import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  
  // 1. Run on every render
  useEffect(() => {
    console.log('This runs on every render');
  });
  
  // 2. Run only on mount (empty dependency array)
  useEffect(() => {
    console.log('This runs only on mount');
    
    // Cleanup function runs on unmount
    return () => {
      console.log('Component unmounted');
    };
  }, []);
  
  // 3. Run when specific dependencies change
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);
  
  // 4. Data fetching example
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      {data && (
        <div>
          <h3>Fetched Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}`,
            language: "javascript",
            notes: "Different ways to use the React useEffect hook",
            readme: `# React useEffect Hook Examples

Examples of how to use the React useEffect hook for different scenarios.

## Use Cases Covered
1. **Run on every render** - No dependency array
2. **Run only on mount** - Empty dependency array
3. **Run when dependencies change** - Specific dependencies in array
4. **Data fetching** - Practical example of API calls

## Cleanup Function
The useEffect hook can return a cleanup function that runs when:
- The component unmounts
- Before the effect runs again (if dependencies change)

This is useful for:
- Cancelling subscriptions
- Clearing timers
- Cleaning up resources

## Common Mistakes to Avoid
- Missing dependencies in the dependency array
- Adding unnecessary dependencies
- Not handling cleanup properly
- Creating infinite loops with state updates inside effects`,
            tags: ["tag-6"],
            folderId: "folder-4",
            createdAt: "2023-04-05T10:20:00.000Z",
            updatedAt: "2023-04-05T10:20:00.000Z",
            isFavorite: false,
            isPublic: false,
        },
    ],
    tags: [
        {
            id: "tag-1",
            name: "Security",
            color: "blue",
        },
        {
            id: "tag-2",
            name: "Firebase",
            color: "orange",
        },
        {
            id: "tag-3",
            name: "Passport",
            color: "green",
        },
        {
            id: "tag-4",
            name: "Database",
            color: "blue",
        },
        {
            id: "tag-5",
            name: "Calculations",
            color: "yellow",
        },
        {
            id: "tag-6",
            name: "React",
            color: "blue",
        },
        {
            id: "tag-7",
            name: "ssr",
            color: "purple",
        },
    ],
};
