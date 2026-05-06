import datetime
import requests


BASE_URL = "http://127.0.0.1:3000"
USER_ID = 123123
CATEGORIES = ["food", "health", "housing", "sports", "education"]


def add_cost(category, description, amount):
    url = BASE_URL + "/api/add/"
    payload = {
        "userid": USER_ID,
        "description": description,
        "category": category,
        "sum": amount,
    }
    response = requests.post(url, json=payload, timeout=15)
    return response


def get_monthly_report(year, month):
    url = f"{BASE_URL}/api/report/?id={USER_ID}&year={year}&month={month}"
    response = requests.get(url, timeout=15)
    return response


def flatten_report_costs(report_json):
    grouped = {}
    for category_obj in report_json.get("costs", []):
        for category_name, items in category_obj.items():
            grouped[category_name] = items
    return grouped


def main():
    now = datetime.datetime.now(datetime.UTC)
    year = now.year
    month = now.month
    run_tag = now.strftime("%Y%m%d%H%M%S")

    print("Category report alignment test")
    print("------------------------------")
    print(f"year={year}, month={month}, user={USER_ID}")

    expected_descriptions = {}
    print("\nAdding one cost per category:")
    for i, category in enumerate(CATEGORIES):
        description = f"cat-test-{category}-{run_tag}"
        expected_descriptions[category] = description
        response = add_cost(category, description, 10 + i)
        print(f"- add {category}: status={response.status_code}, body={response.text}")

    report_response = get_monthly_report(year, month)
    print(f"\nreport status={report_response.status_code}")
    print(f"report body={report_response.text}")

    if report_response.status_code != 200:
        print("\nFAIL: could not fetch report")
        return

    report_json = report_response.json()
    grouped = flatten_report_costs(report_json)

    print("\nValidation results:")
    all_passed = True
    for category in CATEGORIES:
        items = grouped.get(category, [])
        found = any(item.get("description") == expected_descriptions[category] for item in items)
        print(f"- {category}: {'PASS' if found else 'FAIL'} (items={len(items)})")
        all_passed = all_passed and found

    if all_passed:
        print("\nPASS: report endpoint correctly groups costs by all categories.")
    else:
        print("\nFAIL: report endpoint missing at least one inserted category item.")


if __name__ == "__main__":
    main()
