#!/usr/bin/env node

/**
 * Simple page load test script
 * Verifies that each page route returns a valid HTTP response (not 500 errors)
 * 
 * Usage:
 *   npm run test:pages
 *   # or
 *   node scripts/test-pages.mjs [--url=http://localhost:3000]
 */

const BASE_URL = process.env.TEST_URL || process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:3000'

// Pages to test - includes both public and protected routes
const PAGES = [
  { path: '/', name: 'Home', public: true },
  { path: '/login', name: 'Login', public: true },
  { path: '/signup', name: 'Signup', public: true },
  { path: '/dashboard', name: 'Dashboard', public: false },
  { path: '/trades/search', name: 'Search', public: true },
  { path: '/trades/builder', name: 'Trade Builder', public: false },
  { path: '/inventory', name: 'Inventory', public: false },
  { path: '/wants', name: 'Want List', public: false },
  { path: '/pricing/market', name: 'Pricing', public: false },
  { path: '/cards/search', name: 'Cards Search Alias', public: true },
]

// API endpoints to test
const API_ENDPOINTS = [
  { path: '/api/cards/search', name: 'Cards Search API', method: 'GET' },
  { path: '/api/prices/market?itemId=test', name: 'Prices Market API', method: 'GET' },
]

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function testPage(page) {
  const url = `${BASE_URL}${page.path}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow', // Follow redirects (e.g., protected routes redirecting to login)
      headers: {
        'Accept': 'text/html,application/json',
      },
    })

    const status = response.status
    
    // Consider 200-399 as success (including redirects)
    // 401/403 are expected for protected routes without auth
    const isSuccess = status >= 200 && status < 400
    const isExpectedRedirect = !page.public && (status === 401 || status === 403 || status === 307 || status === 308)
    
    return {
      success: isSuccess || isExpectedRedirect,
      status,
      error: null,
      redirected: status >= 300 && status < 400,
    }
  } catch (error) {
    return {
      success: false,
      status: null,
      error: error.message,
      redirected: false,
    }
  }
}

async function testApiEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`
  
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Accept': 'application/json',
      },
    })

    const status = response.status
    
    // APIs can return 400/404 for invalid requests, but shouldn't return 500
    const isSuccess = status < 500
    
    return {
      success: isSuccess,
      status,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      status: null,
      error: error.message,
    }
  }
}

async function runTests() {
  log('\n🧪 Testing Page Loads\n', colors.blue)
  log(`Base URL: ${BASE_URL}\n`, colors.gray)

  // Test pages
  log('📄 Testing Pages:\n', colors.blue)
  const pageResults = []
  
  for (const page of PAGES) {
    process.stdout.write(`  Testing ${page.name.padEnd(25)} ... `)
    const result = await testPage(page)
    pageResults.push({ ...page, ...result })
    
    if (result.success) {
      const statusText = result.redirected ? `✓ ${result.status} (redirect)` : `✓ ${result.status}`
      log(statusText, colors.green)
    } else {
      const statusText = result.status ? `✗ ${result.status}` : '✗ Failed'
      log(statusText, colors.red)
      if (result.error) {
        log(`    Error: ${result.error}`, colors.red)
      }
    }
  }

  // Test API endpoints
  log('\n🔌 Testing API Endpoints:\n', colors.blue)
  const apiResults = []
  
  for (const endpoint of API_ENDPOINTS) {
    process.stdout.write(`  Testing ${endpoint.name.padEnd(25)} ... `)
    const result = await testApiEndpoint(endpoint)
    apiResults.push({ ...endpoint, ...result })
    
    if (result.success) {
      log(`✓ ${result.status}`, colors.green)
    } else {
      const statusText = result.status ? `✗ ${result.status}` : '✗ Failed'
      log(statusText, colors.red)
      if (result.error) {
        log(`    Error: ${result.error}`, colors.red)
      }
    }
  }

  // Summary
  const allResults = [...pageResults, ...apiResults]
  const passed = allResults.filter(r => r.success).length
  const failed = allResults.filter(r => !r.success).length
  const total = allResults.length

  log('\n' + '='.repeat(50), colors.gray)
  log('\n📊 Summary:', colors.blue)
  log(`  Total: ${total}`, colors.reset)
  log(`  Passed: ${passed}`, colors.green)
  log(`  Failed: ${failed}`, failed > 0 ? colors.red : colors.reset)
  
  if (failed > 0) {
    log('\n❌ Failed Tests:', colors.red)
    allResults
      .filter(r => !r.success)
      .forEach(r => {
        const name = r.name || r.path
        const status = r.status ? ` (Status: ${r.status})` : ''
        const error = r.error ? ` - ${r.error}` : ''
        log(`  • ${name}${status}${error}`, colors.red)
      })
  }

  log('\n' + '='.repeat(50) + '\n', colors.gray)

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0)
}

// Check if server is reachable first
async function checkServer() {
  try {
    const response = await fetch(BASE_URL, { method: 'HEAD' })
    return true
  } catch (error) {
    log(`\n❌ Cannot reach server at ${BASE_URL}`, colors.red)
    log('   Make sure the dev server is running:', colors.yellow)
    log('   npm run dev\n', colors.yellow)
    process.exit(1)
  }
}

// Run the tests
checkServer().then(() => runTests()).catch(error => {
  log(`\n❌ Test script error: ${error.message}`, colors.red)
  process.exit(1)
})

