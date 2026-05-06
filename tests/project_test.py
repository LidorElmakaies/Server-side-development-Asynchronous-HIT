import requests
import sys


filename = input("filename=")

# Single-server setup:
# a: logs, b: users, c: costs, d: about
# In this project all are the same base URL.
base_url = "http://127.0.0.1:3000"
a = base_url
b = base_url
c = base_url
d = base_url


output = open(filename, "w", encoding="utf-8")
sys.stdout = output


print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)
print()

print("testing getting the about")
print("-------------------------")

try:
    text = ""
    url = d + "/api/about/"
    data = requests.get(url, timeout=15)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(data.json())
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 1")
print("------------------------------")

try:
    text = ""
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url, timeout=15)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing adding cost item")
print("----------------------------------")

try:
    text = ""
    url = c + "/api/add/"
    data = requests.post(
        url,
        json={"userid": 123123, "description": "milk 9", "category": "food", "sum": 8},
        timeout=15,
    )
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing add cost with past year (should fail)")
print("---------------------------------------------")

try:
    url = c + "/api/add/"
    data = requests.post(
        url,
        json={
            "userid": 123123,
            "description": "past year test",
            "category": "food",
            "sum": 5,
            "createdAt": "2025-12-15T10:00:00.000Z",
        },
        timeout=15,
    )
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing add cost with past month in 2026 (should fail)")
print("------------------------------------------------------")

try:
    url = c + "/api/add/"
    data = requests.post(
        url,
        json={
            "userid": 123123,
            "description": "past month test",
            "category": "food",
            "sum": 6,
            "createdAt": "2026-01-15T10:00:00.000Z",
        },
        timeout=15,
    )
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
except Exception as e:
    print("problem")
    print(e)

print("")
print()

print("testing getting the report - 2")
print("------------------------------")

try:
    text = ""
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url, timeout=15)
    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print(data.content)
    print("data.text=" + data.text)
    print(text)
except Exception as e:
    print("problem")
    print(e)

print("")
output.close()
