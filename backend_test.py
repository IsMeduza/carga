#!/usr/bin/env python3
"""
Comprehensive backend API tests for the Spanish cargo transport platform.
Tests all endpoints: /api/stats, /api/cargas, /api/envios, /api/transportistas, /api/chat
"""

import requests
import sys
import json
import time
from datetime import datetime
import uuid

class CargaAPITester:
    def __init__(self, base_url="https://moltbot-config-744.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_result(self, test_name, success, response_data=None, error_msg=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED: {error_msg}")
            
        self.test_results.append({
            "test": test_name,
            "success": success,
            "response": response_data,
            "error": error_msg
        })

    def run_test(self, name, method, endpoint, expected_status=200, data=None, timeout=10):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
                
            success = response.status_code == expected_status
            response_data = None
            
            if success:
                try:
                    response_data = response.json()
                    print(f"   Status: {response.status_code} ✓")
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response: Dict with keys: {list(response_data.keys())}")
                    else:
                        print(f"   Response: {type(response_data)}")
                except:
                    print(f"   Status: {response.status_code} ✓ (non-JSON response)")
                    
                self.log_result(name, True, response_data)
                return True, response_data
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {response.text}"
                print(f"   Status: {response.status_code} ✗")
                self.log_result(name, False, None, error_msg)
                return False, {}

        except requests.exceptions.RequestException as e:
            error_msg = f"Request failed: {str(e)}"
            print(f"   Error: {error_msg}")
            self.log_result(name, False, None, error_msg)
            return False, {}

    def test_health_endpoint(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health")

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        success, data = self.run_test("Stats Endpoint", "GET", "stats")
        if success and data:
            # Validate stats structure
            required_keys = ['cargas_disponibles', 'envios_en_curso', 'completados_mes', 'transportistas_activos']
            missing_keys = [key for key in required_keys if key not in data]
            if missing_keys:
                self.log_result("Stats Structure Validation", False, None, f"Missing keys: {missing_keys}")
                return False
            else:
                self.log_result("Stats Structure Validation", True, data)
                print(f"   Stats: Cargas: {data['cargas_disponibles']}, Envios: {data['envios_en_curso']}")
        return success

    def test_cargas_endpoint(self):
        """Test cargas endpoint"""
        success, data = self.run_test("Cargas List", "GET", "cargas")
        if success and data:
            if isinstance(data, list) and len(data) > 0:
                # Validate first carga structure
                carga = data[0]
                required_fields = ['id', 'origen', 'destino', 'peso', 'precio', 'tipo', 'estado']
                missing_fields = [field for field in required_fields if field not in carga]
                if missing_fields:
                    self.log_result("Carga Structure Validation", False, None, f"Missing fields: {missing_fields}")
                    return False
                else:
                    self.log_result("Carga Structure Validation", True, carga)
                    print(f"   Sample Carga: {carga['origen']} -> {carga['destino']}, {carga['peso']}t, {carga['precio']}EUR")
                    # Test individual carga retrieval
                    self.test_individual_carga(carga['id'])
            else:
                self.log_result("Cargas Data Validation", False, None, "No cargas returned or invalid format")
                return False
        return success

    def test_individual_carga(self, carga_id):
        """Test getting individual carga by ID"""
        return self.run_test(f"Individual Carga ({carga_id[:8]}...)", "GET", f"cargas/{carga_id}")

    def test_envios_endpoint(self):
        """Test envios endpoint"""
        success, data = self.run_test("Envios List", "GET", "envios")
        if success and data:
            if isinstance(data, list) and len(data) > 0:
                envio = data[0]
                required_fields = ['id', 'origen', 'destino', 'peso', 'precio', 'estado', 'progreso']
                missing_fields = [field for field in required_fields if field not in envio]
                if missing_fields:
                    self.log_result("Envio Structure Validation", False, None, f"Missing fields: {missing_fields}")
                    return False
                else:
                    self.log_result("Envio Structure Validation", True, envio)
                    print(f"   Sample Envio: {envio['origen']} -> {envio['destino']}, {envio['progreso']}% {envio['estado']}")
            else:
                print("   No envios data available (this is acceptable for new system)")
                self.log_result("Envios Data Info", True, None, "No envios found - acceptable")
        return success

    def test_transportistas_endpoint(self):
        """Test transportistas endpoint"""
        success, data = self.run_test("Transportistas List", "GET", "transportistas")
        if success and data:
            if isinstance(data, list) and len(data) > 0:
                transportista = data[0]
                required_fields = ['id', 'nombre', 'email', 'estado', 'rating']
                missing_fields = [field for field in required_fields if field not in transportista]
                if missing_fields:
                    self.log_result("Transportista Structure Validation", False, None, f"Missing fields: {missing_fields}")
                    return False
                else:
                    self.log_result("Transportista Structure Validation", True, transportista)
                    print(f"   Sample Transportista: {transportista['nombre']}, Rating: {transportista['rating']}, Estado: {transportista['estado']}")
            else:
                print("   No transportistas data available")
                self.log_result("Transportistas Data Info", True, None, "No transportistas found")
        return success

    def test_chat_endpoint(self):
        """Test AI chat endpoint"""
        print(f"\n🤖 Testing AI Chat Integration...")
        
        # Test simple greeting
        chat_message = "Hola, que cargas tienes disponibles?"
        success, data = self.run_test(
            "Chat - Simple Query", 
            "POST", 
            "chat", 
            200, 
            {"message": chat_message},
            timeout=30  # AI responses can be slower
        )
        
        if success and data:
            if 'response' in data and 'session_id' in data:
                self.log_result("Chat Response Structure", True, data)
                print(f"   AI Response: {data['response'][:100]}...")
                print(f"   Session ID: {data['session_id']}")
                
                # Test follow-up message with session
                time.sleep(2)  # Brief pause between requests
                followup_success, followup_data = self.run_test(
                    "Chat - Follow-up with Session",
                    "POST",
                    "chat",
                    200,
                    {"message": "Busca cargas de Madrid a Barcelona", "session_id": data['session_id']},
                    timeout=30
                )
                
                if followup_success:
                    print(f"   Follow-up Response: {followup_data.get('response', '')[:100]}...")
                
                return followup_success
            else:
                self.log_result("Chat Response Structure", False, None, "Missing response or session_id fields")
                return False
        return success

    def test_carga_acceptance(self):
        """Test accepting a carga"""
        print(f"\n📦 Testing Carga Acceptance Flow...")
        
        # First get available cargas
        success, cargas = self.run_test("Get Available Cargas for Acceptance", "GET", "cargas")
        if not success or not cargas:
            print("   Cannot test acceptance - no cargas available")
            return False
            
        # Find an available carga
        available_carga = None
        for carga in cargas:
            if carga.get('estado') == 'disponible':
                available_carga = carga
                break
                
        if not available_carga:
            print("   No available cargas found for acceptance test")
            self.log_result("Carga Acceptance", False, None, "No available cargas")
            return False
            
        # Accept the carga
        carga_id = available_carga['id']
        success, data = self.run_test(
            f"Accept Carga ({carga_id[:8]}...)",
            "POST",
            f"cargas/{carga_id}/aceptar",
            200
        )
        
        if success and data:
            if 'ok' in data and 'envio_id' in data:
                self.log_result("Carga Acceptance Response", True, data)
                print(f"   Carga accepted! Envio ID: {data['envio_id']}")
                return True
            else:
                self.log_result("Carga Acceptance Response", False, None, "Missing ok or envio_id in response")
        return success

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting Comprehensive Backend API Tests for Spanish Cargo Platform")
        print("=" * 80)
        
        # Test each endpoint
        test_methods = [
            self.test_health_endpoint,
            self.test_stats_endpoint,
            self.test_cargas_endpoint,
            self.test_envios_endpoint,
            self.test_transportistas_endpoint,
            self.test_chat_endpoint,
            self.test_carga_acceptance,
        ]
        
        for test_method in test_methods:
            try:
                test_method()
                time.sleep(0.5)  # Brief pause between tests
            except Exception as e:
                print(f"❌ Test {test_method.__name__} failed with exception: {e}")
                self.log_result(test_method.__name__, False, None, str(e))
        
        # Print final results
        print("\n" + "=" * 80)
        print("📊 FINAL TEST RESULTS")
        print("=" * 80)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            print("\nFailed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['error']}")
            return 1

def main():
    tester = CargaAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())