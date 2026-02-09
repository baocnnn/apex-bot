import httpx
import asyncio
import os

SLACK_BOT_TOKEN = "SLACK_BOT_TOKEN_GOES_HERE" 

async def get_channels():
    print(f"Using token: {SLACK_BOT_TOKEN[:20]}...")  # Show first 20 chars
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://slack.com/api/conversations.list",
            headers={"Authorization": f"Bearer {SLACK_BOT_TOKEN}"},
            json={"types": "public_channel,private_channel"}
        )
        data = response.json()
        
        print(f"\nAPI Response:")
        print(f"Status: {data.get('ok')}")
        print(f"Error: {data.get('error', 'None')}")
        print(f"Channels found: {len(data.get('channels', []))}")
        
        if not data.get("ok"):
            print(f"\n❌ API Error: {data.get('error')}")
            print("Full response:", data)
            return
        
        print("\n📋 All channels:")
        print("-" * 60)
        for channel in data.get("channels", []):
            channel_type = "🔒 Private" if channel.get("is_private") else "📢 Public"
            print(f"{channel_type} #{channel['name']:<30} → {channel['id']}")
            
            if channel["name"] == "meetings":
                print("\n" + "=" * 60)
                print(f"✅ Found #meetings! ID: {channel['id']}")
                print("=" * 60)

if __name__ == "__main__":
    asyncio.run(get_channels())