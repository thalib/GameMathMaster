import os
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto(f'file://{os.getcwd()}/index.html')

    page.screenshot(path='jules-scratch/verification/01-game-screen.png')

    page.click('#level-select-btn')
    page.screenshot(path='jules-scratch/verification/02-level-select-screen.png')

    page.click('#achievements-btn')
    page.screenshot(path='jules-scratch/verification/03-achievements-screen.png')

    page.click('#settings-btn')
    page.screenshot(path='jules-scratch/verification/04-settings-screen.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
