import urllib.request
import struct
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://kih.com.pk/wp-content/uploads/2019/01/hospital-overview-image-1.webp"
headers = {
    'User-Agent': 'Mozilla/5.0'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = response.read()
        print("Size:", len(data))
        # Save image to check
        with open("C:\\Users\\LAPTOP HOUSE\\.gemini\\antigravity-ide\\brain\\34b54e21-2be7-4cb6-9ac8-3ea179cc75ea\\overview.webp", "wb") as f:
            f.write(data)
        print("Downloaded successfully")
except Exception as e:
    print("Error:", e)
