import calendar
import datetime
import requests


BASE_URL = "http://127.0.0.1:3000"
USER_ID = 123123


def main():
    now = datetime.datetime.now(datetime.UTC)
    if now.month == 12:
        target_year = now.year + 1
        target_month = 1
    else:
        target_year = now.year
        target_month = now.month + 1

    day = min(now.day, calendar.monthrange(target_year, target_month)[1])
    target_dt = datetime.datetime(target_year, target_month, day, 10, 0, 0, tzinfo=datetime.UTC)
    created_at = target_dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    description = "future-created-at-" + now.strftime("%Y%m%d%H%M%S")

    add_url = BASE_URL + "/api/add/"
    add_payload = {
        "userid": USER_ID,
        "description": description,
        "category": "education",
        "sum": 33,
        "createdAt": created_at,
    }
    add_response = requests.post(add_url, json=add_payload, timeout=15)

    report_url = f"{BASE_URL}/api/report/?id={USER_ID}&year={target_year}&month={target_month}"
    report_response = requests.get(report_url, timeout=15)

    found = False
    if report_response.status_code == 200:
        report_json = report_response.json()
        for category_group in report_json.get("costs", []):
            if "education" in category_group:
                for item in category_group["education"]:
                    if item.get("description") == description:
                        found = True
                        break

    print("createdAt used:", created_at)
    print("add status:", add_response.status_code)
    print("add body:", add_response.text)
    print("report url:", report_url)
    print("report status:", report_response.status_code)
    print("found in target month report:", found)


if __name__ == "__main__":
    main()
