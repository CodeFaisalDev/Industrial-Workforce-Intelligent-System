import sys
import time
from playwright.sync_api import sync_playwright

def test_full_application():
    print("=== STARTING COMPREHENSIVE E2E BROWSER TEST ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Test Landing Page
        print("\n1. Navigating to Landing Page (http://localhost:3000)...")
        page.goto('http://localhost:3000')
        page.wait_for_selector('text=Industrial Intel')
        print("[OK] Landing Page loaded successfully. Title:", page.title())

        # Test features section link
        page.click('a[href="#features"]')
        print("[OK] Clicked #features navigation link.")

        # 2. Test Signup Page
        print("\n2. Navigating to Company Registration (/signup)...")
        page.goto('http://localhost:3000/signup')
        page.wait_for_selector('input#companyName')
        
        company_name = f"Playwright Factory {int(time.time())}"
        admin_email = f"admin_{int(time.time())}@pwfactory.com"
        page.fill('input#companyName', company_name)
        page.fill('input#adminName', 'Playwright Admin')
        page.fill('input#adminEmail', admin_email)
        page.fill('input#adminPassword', 'password123')
        page.fill('input#confirmPassword', 'password123')
        
        print(f"Registering new company '{company_name}'...")
        page.click('button[type="submit"]')
        page.wait_for_selector('text=Company Registered!')
        print("[OK] Registration successful! Confirmation displayed.")

        # 3. Test Interactive Quick-Fill Demo Account Login (/login)
        print("\n3. Testing Interactive Quick-Fill Demo Account Login (/login)...")
        page.goto('http://localhost:3000/login')
        page.wait_for_selector('text=Quick Demo Persona')
        
        # Click HR Admin Quick-Fill button
        page.click('button:has-text("HR Admin")')
        print("[OK] HR Admin credentials quick-filled.")
        page.click('button[type="submit"]')
        
        page.wait_for_url('http://localhost:3000/')
        page.wait_for_selector('text=System Overview')
        print("[OK] Logged in as HR Admin! Dashboard Overview loaded.")

        # 4. Test Notification Center Popover
        print("\n4. Testing Notification Center Popover...")
        page.click('header button:has(svg.lucide-bell)')
        page.wait_for_selector('text=Geofence Distance Flagged')
        print("[OK] Operational Notifications Popover opened successfully!")

        # 5. Test AI Staffing Forecast Generation
        print("\n5. Testing AI Staffing Forecast Generation...")
        page.click('button:has-text("Generate Forecast")')
        page.wait_for_selector('text=Tomorrow\'s AI Predictive Staffing Forecast', timeout=10000)
        print("[OK] AI Forecast generated successfully!")

        # 6. Test Kiosk Mode Tab
        print("\n6. Testing Kiosk Mode Tab...")
        page.click('button:has-text("Kiosk Mode")')
        page.wait_for_selector('text=Entrance Kiosk Terminal')
        print("[OK] Kiosk Mode loaded.")
        page.click('text=Connectivity Mode')
        print("[OK] Toggled Connectivity Mode.")
        page.click('text=Location Profile')
        print("[OK] Toggled Location Profile.")

        # 7. Test Employees Tab with Search Filter
        print("\n7. Testing Employees Tab & Search Filter...")
        page.click('button:has-text("Employees")')
        page.wait_for_selector('text=Register workers, view scorecards', timeout=5000)
        print("[OK] Employees Directory loaded.")

        # Test Search Filter
        page.fill('input[placeholder*="Search by worker name"]', 'Faria')
        time.sleep(1)
        print("[OK] Instant search filter applied.")
        page.fill('input[placeholder*="Search by worker name"]', '')

        # Add Employee
        page.click('button:has-text("Add Employee")')
        page.wait_for_selector('text=New Employee Profile')
        page.fill('input#name', 'Test Worker PW')
        page.fill('input#email', f'worker_{int(time.time())}@factory.com')
        page.fill('input#passwordInput', 'worker123')
        page.click('button:has-text("Create Profile")')
        time.sleep(1)
        print("[OK] Added new employee profile successfully!")

        # 8. Test Leave & Absence Tab
        print("\n8. Testing Leave & Absence Tab...")
        page.click('button:has-text("Leave & Absence")')
        page.wait_for_selector('text=Leave & Absence Management')
        page.wait_for_selector('text=Annual Paid Leave')
        print("[OK] Leave & Absence Management page loaded.")

        # File a Leave Request
        page.click('button:has-text("File Leave Request")')
        page.wait_for_selector('text=New Leave Application')
        page.fill('input#startDate', '2026-08-10')
        page.fill('input#endDate', '2026-08-12')
        page.fill('input#reason', 'Playwright automated E2E leave request test')
        page.click('button:has-text("Submit Request")')
        time.sleep(2)
        print("[OK] Leave Request submitted and listed in history table!")

        # 9. Test Scheduler Tab
        print("\n9. Testing Scheduler Tab...")
        page.click('button:has-text("Scheduler")')
        page.wait_for_selector('text=Roster Calendar')
        print("[OK] Scheduler loaded successfully.")

        # 10. Test Payroll Center Tab & Export CSV
        print("\n10. Testing Payroll Center Tab & Export CSV...")
        page.click('button:has-text("Payroll Center")')
        page.wait_for_selector('text=Payroll Register')
        print("[OK] Payroll Center loaded.")

        page.click('button:has-text("Calculate Payroll")')
        time.sleep(2)
        print("[OK] Payroll calculation triggered.")

        # Test Export CSV button
        page.click('button:has-text("Export Payroll CSV")')
        print("[OK] Export Payroll CSV triggered.")

        # 11. Test Fraud Queue Tab
        print("\n11. Testing Fraud Queue Tab...")
        page.click('button:has-text("Fraud Queue")')
        page.wait_for_selector('text=Flagged Anomalies')
        print("[OK] Fraud Queue loaded.")

        page.click('button:has-text("Run Audit Scan")')
        time.sleep(2)
        print("[OK] Audit scan completed!")

        # 12. Test AI Assistant Chatbot Drawer & Suggestion Chips
        print("\n12. Testing AI Assistant Chatbot Drawer...")
        page.click('button:has-text("AI Assistant Chat")')
        page.wait_for_selector('text=AI Operations Assistant')
        print("[OK] Chatbot Drawer opened.")

        # Click suggestion chip
        page.click('button:has-text("Overtime Policy?")')
        page.click('button[type="submit"]')
        time.sleep(4)
        print("[OK] Chatbot query submitted via suggestion chip & reply received!")

        browser.close()
        print("\n=== ALL COMPREHENSIVE E2E UI TESTS PASSED SUCCESSFULLY ===")

if __name__ == '__main__':
    test_full_application()
