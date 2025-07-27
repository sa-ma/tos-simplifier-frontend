import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const level = formData.get('level') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!level) {
      return NextResponse.json(
        { error: 'No simplification level provided' },
        { status: 400 }
      );
    }

    // Validate level
    if (!['8th', '12th'].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level. Must be 8th or 12th' },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.API_BASE_URL;
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'API base URL not configured' },
        { status: 500 }
      );
    }

    // Create new FormData for the backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Make request to the backend
    const response = await fetch(`${apiBaseUrl}/simplify?level=${level}`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter out "not specified" entries from the response
    const filteredData: { [key: string]: string[] } = {};
    
    for (const [section, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        // Filter out items that contain "not specified" (case insensitive)
        const filteredItems = items.filter((item: string) => 
          !item.toLowerCase().includes('not specified')
        );
        
        // Only include sections that have items after filtering
        if (filteredItems.length > 0) {
          filteredData[section] = filteredItems;
        }
      }
    }
    
    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 