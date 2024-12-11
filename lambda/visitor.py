import json  # For handling JSON data (encoding/decoding)
import boto3  # AWS SDK for Python to interact with AWS services
from datetime import datetime  # For generating timestamps
import uuid  # For generating unique visit IDs

# Create a connection to DynamoDB using boto3
dynamodb = boto3.resource('dynamodb')
# Connect to your specific table named 'Visitors'
table = dynamodb.Table('Visitors')

def handler(event, context):
    """
    This is the main function that AWS Lambda will call
    'event' contains information about the incoming request
    'context' contains information about the Lambda execution environment
    """
    try:
        # Generate a unique ID for this visit using UUID (Universally Unique Identifier)
        # uuid4() creates a random UUID, and str() converts it to a string
        visit_id = str(uuid.uuid4())
        
        # Create a new record (item) in the DynamoDB table
        table.put_item(
            Item={
                # The unique identifier for this visit
                'visit_id': visit_id,
                
                # Current time in ISO format (e.g., "2024-03-27T15:30:00.123456")
                'timestamp': datetime.now().isoformat(),
                
                # Get the visitor's browser info (User-Agent)
                # Uses nested .get() to safely handle missing data
                'user_agent': event.get('headers', {}).get('User-Agent', 'Unknown'),
                
                # Get the visitor's IP address
                # Uses nested .get() to safely handle missing data
                'ip_address': event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'Unknown')
            }
        )
        
        # Count total number of visits by scanning the table
        # Note: Scan operation reads every item in the table
        response = table.scan(
            Select='COUNT'  # Only get the count, not the actual items
        )
        
        # Get the total count from the scan response
        total_visits = response['Count']
        
        # Prepare the JSON response that will be sent back
        response_body = {
            'visitor_count': total_visits,
            'message': 'Visit recorded successfully'
        }
        
        # Return a success response
        return {
            # HTTP status code 200 means success
            'statusCode': 200,
            
            # CORS headers allow the API to be called from web browsers
            'headers': {
                # '*' allows requests from any domain
                'Access-Control-Allow-Origin': '*',
                # Only allow GET requests
                'Access-Control-Allow-Methods': 'GET',
                # Allow Content-Type header
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            # Convert our response_body dictionary to a JSON string
            'body': json.dumps(response_body)
        }
        
    except Exception as e:
        # If anything goes wrong, this code will run
        
        # Prepare error message
        error_response = {
            'message': f'Error recording visit: {str(e)}'
        }
        
        # Return an error response
        return {
            # HTTP status code 500 means server error
            'statusCode': 500,
            
            # Include CORS headers even in error responses
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            # Convert error message to JSON string
            'body': json.dumps(error_response)
        }