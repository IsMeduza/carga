#!/usr/bin/env python3
"""
Backend API Testing for Carga Platform
Testing all endpoints as specified in the review request
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8001"
API_URL = f"{BASE_URL}/api"

def print_test_result(test_name, success, message="", data=None):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"    {message}")
    if data and isinstance(data, dict):
        print(f"    Response: {json.dumps(data, indent=2)}")
    print()

def test_root_endpoint():
    """Test GET /api/ - Should return status ok message"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "ok":
                print_test_result("Root Endpoint", True, f"Status: {response.status_code}", data)
                return True
            else:
                print_test_result("Root Endpoint", False, f"Status OK but missing 'status: ok' field", data)
                return False
        else:
            print_test_result("Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Root Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_stats_endpoint():
    """Test GET /api/stats - Should return stats with expected fields"""
    try:
        response = requests.get(f"{API_URL}/stats", timeout=10)
        if response.status_code == 200:
            data = response.json()
            expected_fields = ["cargas_disponibles", "envios_en_curso", "completados_mes", "transportistas_activos"]
            missing_fields = [field for field in expected_fields if field not in data]
            
            if not missing_fields:
                print_test_result("Stats Endpoint", True, f"All expected fields present", data)
                return True
            else:
                print_test_result("Stats Endpoint", False, f"Missing fields: {missing_fields}", data)
                return False
        else:
            print_test_result("Stats Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Stats Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_cargas_endpoint():
    """Test GET /api/cargas - Should return list of cargas with total count"""
    try:
        response = requests.get(f"{API_URL}/cargas", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            if "cargas" in data and "total" in data:
                cargas_count = len(data["cargas"])
                total_count = data["total"]
                
                # Check if we have expected 10 cargas
                if total_count == 10:
                    print_test_result("Cargas Endpoint", True, f"Retrieved {cargas_count} cargas, total: {total_count}")
                    return True
                else:
                    print_test_result("Cargas Endpoint", False, f"Expected 10 cargas, got {total_count}")
                    return False
            else:
                print_test_result("Cargas Endpoint", False, f"Missing 'cargas' or 'total' field", data)
                return False
        else:
            print_test_result("Cargas Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Cargas Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_cargas_with_filter():
    """Test GET /api/cargas?tipo=urgente - Should return filtered cargas"""
    try:
        response = requests.get(f"{API_URL}/cargas?tipo=urgente", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            if "cargas" in data:
                urgente_cargas = [c for c in data["cargas"] if c.get("tipo") == "urgente"]
                total_cargas = len(data["cargas"])
                
                if total_cargas == len(urgente_cargas) and total_cargas > 0:
                    print_test_result("Cargas Filter (urgente)", True, f"Retrieved {total_cargas} urgente cargas")
                    return True
                elif total_cargas == 0:
                    print_test_result("Cargas Filter (urgente)", False, "No urgente cargas found")
                    return False
                else:
                    print_test_result("Cargas Filter (urgente)", False, f"Filter not working properly: {total_cargas} total, {len(urgente_cargas)} urgente")
                    return False
            else:
                print_test_result("Cargas Filter (urgente)", False, f"Missing 'cargas' field", data)
                return False
        else:
            print_test_result("Cargas Filter (urgente)", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Cargas Filter (urgente)", False, f"Connection error: {str(e)}")
        return False

def test_envios_endpoint():
    """Test GET /api/envios - Should return list of envios"""
    try:
        response = requests.get(f"{API_URL}/envios", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            if "envios" in data:
                envios_count = len(data["envios"])
                
                # Check if we have expected 7 envios
                if envios_count == 7:
                    print_test_result("Envios Endpoint", True, f"Retrieved {envios_count} envios")
                    return True
                else:
                    print_test_result("Envios Endpoint", False, f"Expected 7 envios, got {envios_count}")
                    return False
            else:
                print_test_result("Envios Endpoint", False, f"Missing 'envios' field", data)
                return False
        else:
            print_test_result("Envios Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Envios Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_envios_with_filter():
    """Test GET /api/envios?estado=en_transito - Should return filtered envios"""
    try:
        response = requests.get(f"{API_URL}/envios?estado=en_transito", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            if "envios" in data:
                en_transito_envios = [e for e in data["envios"] if e.get("estado") == "en_transito"]
                total_envios = len(data["envios"])
                
                if total_envios == len(en_transito_envios) and total_envios > 0:
                    print_test_result("Envios Filter (en_transito)", True, f"Retrieved {total_envios} en_transito envios")
                    return True
                elif total_envios == 0:
                    print_test_result("Envios Filter (en_transito)", False, "No en_transito envios found")
                    return False
                else:
                    print_test_result("Envios Filter (en_transito)", False, f"Filter not working: {total_envios} total, {len(en_transito_envios)} en_transito")
                    return False
            else:
                print_test_result("Envios Filter (en_transito)", False, f"Missing 'envios' field", data)
                return False
        else:
            print_test_result("Envios Filter (en_transito)", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Envios Filter (en_transito)", False, f"Connection error: {str(e)}")
        return False

def test_transportistas_endpoint():
    """Test GET /api/transportistas - Should return list of transportistas"""
    try:
        response = requests.get(f"{API_URL}/transportistas", timeout=10)
        if response.status_code == 200:
            data = response.json()
            
            if "transportistas" in data:
                transportistas_count = len(data["transportistas"])
                
                # Check if we have expected 8 transportistas
                if transportistas_count == 8:
                    print_test_result("Transportistas Endpoint", True, f"Retrieved {transportistas_count} transportistas")
                    return True
                else:
                    print_test_result("Transportistas Endpoint", False, f"Expected 8 transportistas, got {transportistas_count}")
                    return False
            else:
                print_test_result("Transportistas Endpoint", False, f"Missing 'transportistas' field", data)
                return False
        else:
            print_test_result("Transportistas Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Transportistas Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_chat_endpoint():
    """Test POST /api/chat - Should return response for chat message"""
    try:
        payload = {"message": "hola", "session_id": "test123"}
        response = requests.post(f"{API_URL}/chat", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            required_fields = ["response", "session_id"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                if data["session_id"] == "test123":
                    print_test_result("Chat Endpoint", True, f"Chat working correctly", data)
                    return True
                else:
                    print_test_result("Chat Endpoint", False, f"Session ID mismatch: expected test123, got {data.get('session_id')}")
                    return False
            else:
                print_test_result("Chat Endpoint", False, f"Missing fields: {missing_fields}", data)
                return False
        else:
            print_test_result("Chat Endpoint", False, f"HTTP {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_test_result("Chat Endpoint", False, f"Connection error: {str(e)}")
        return False

def test_auth_me_unauthorized():
    """Test GET /api/auth/me - Should return 401 without auth token"""
    try:
        response = requests.get(f"{API_URL}/auth/me", timeout=10)
        
        if response.status_code == 401:
            print_test_result("Auth Me (Unauthorized)", True, f"Correctly returned 401 without token")
            return True
        else:
            print_test_result("Auth Me (Unauthorized)", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Auth Me (Unauthorized)", False, f"Connection error: {str(e)}")
        return False

def test_auth_profile_unauthorized():
    """Test POST /api/auth/profile - Should return 401 without auth token"""
    try:
        payload = {"full_name": "Test User", "company": "Test Company"}
        response = requests.post(f"{API_URL}/auth/profile", json=payload, timeout=10)
        
        if response.status_code == 401:
            print_test_result("Auth Profile (Unauthorized)", True, f"Correctly returned 401 without token")
            return True
        else:
            print_test_result("Auth Profile (Unauthorized)", False, f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Auth Profile (Unauthorized)", False, f"Connection error: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for Carga Platform")
    print("=" * 60)
    
    tests = [
        test_root_endpoint,
        test_stats_endpoint,
        test_cargas_endpoint,
        test_cargas_with_filter,
        test_envios_endpoint,
        test_envios_with_filter,
        test_transportistas_endpoint,
        test_chat_endpoint,
        test_auth_me_unauthorized,
        test_auth_profile_unauthorized
    ]
    
    passed = 0
    failed = 0
    
    for test_func in tests:
        if test_func():
            passed += 1
        else:
            failed += 1
    
    print("=" * 60)
    print(f"📊 TEST SUMMARY:")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success Rate: {(passed/(passed+failed))*100:.1f}%")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)