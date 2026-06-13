import test, { describe } from 'node:test';
import assert from 'node:assert';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../services/auth.service.js';

describe('Auth Service Tests', () => {
  test('should hash and verify passwords correctly', () => {
    const password = 'SuperSecretPassword123';
    const hash = hashPassword(password);
    
    assert.ok(hash.includes(':'), 'Hash should contain salt separator');
    assert.strictEqual(comparePassword(password, hash), true, 'Valid password should pass');
    assert.strictEqual(comparePassword('wrong_password', hash), false, 'Invalid password should fail');
  });

  test('should sign and verify JWT tokens correctly', () => {
    const payload = { userId: 'test-user-id-123' };
    const token = generateToken(payload);
    
    assert.ok(token, 'Token should be generated');
    const decoded = verifyToken(token);
    assert.ok(decoded, 'Token should be decodable');
    assert.strictEqual(decoded.userId, payload.userId, 'Payload data should match');
  });
  
  test('should reject expired or tampered tokens', () => {
    const payload = { userId: 'test-user-id-123' };
    const token = generateToken(payload);
    
    // Tamper token
    const tampered = token + 'invalid';
    assert.strictEqual(verifyToken(tampered), null, 'Tampered token should be rejected');
  });
});
