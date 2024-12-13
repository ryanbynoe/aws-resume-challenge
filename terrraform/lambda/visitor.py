import json
import boto3
import traceback
from decimal import Decimal
from datetime import datetime

# Custom JSON encoder to handle Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Visitors')

def handler(event, context):
    # Log the full event for debugging
    print(f"Received event: {json.dumps(event)}")
    
    cors_headers = {
        'Access-Control-Allow-Origin': 'https://ryanonacloud.com',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    }

    try:
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'message': 'CORS preflight successful'})
            }

        if event.get('httpMethod') == 'GET':
            try:
                # First, try to get the current count
                print("Attempting to get current count...")
                get_response = table.get_item(
                    Key={'id': 'visitor_count'}
                )
                print(f"Get response: {json.dumps(get_response, cls=DecimalEncoder)}")

                # Initialize counter if it doesn't exist
                if 'Item' not in get_response:
                    print("Counter not found, initializing...")
                    table.put_item(
                        Item={
                            'id': 'visitor_count',
                            'visitor_count': 0
                        }
                    )

                # Increment the counter
                print("Incrementing counter...")
                update_response = table.update_item(
                    Key={'id': 'visitor_count'},
                    UpdateExpression='ADD visitor_count :inc',
                    ExpressionAttributeValues={':inc': 1},
                    ReturnValues='UPDATED_NEW'
                )
                print(f"Update response: {json.dumps(update_response, cls=DecimalEncoder)}")

                visitor_count = int(update_response['Attributes']['visitor_count'])
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'visitor_count': visitor_count,
                        'message': 'Count updated successfully'
                    })
                }
                
            except Exception as e:
                print(f"Error during DynamoDB operation: {str(e)}")
                print(f"Traceback: {traceback.format_exc()}")
                return {
                    'statusCode': 500,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'message': 'Database operation failed',
                        'error': str(e)
                    })
                }

        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({
                'message': f'Unsupported HTTP method: {event.get("httpMethod")}'
            })
        }

    except Exception as e:
        print(f"General error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({
                'message': 'Server error',
                'error': str(e)
            })
        }