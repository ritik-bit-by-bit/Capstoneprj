package org.nagarro.fullstackassignment.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordPolicyTest {

    @Test
    void shouldAcceptValidPassword() {
        assertTrue(PasswordPolicy.isValid("Strong@123"));
    }

    @Test
    void shouldRejectNullPassword() {
        assertFalse(PasswordPolicy.isValid(null));
    }

    @Test
    void shouldRejectShortPassword() {
        assertFalse(PasswordPolicy.isValid("Ab1@"));
    }

    @Test
    void shouldRejectPasswordWithoutUppercase() {
        assertFalse(PasswordPolicy.isValid("lower@123"));
    }

    @Test
    void shouldRejectPasswordWithoutSpecialCharacter() {
        assertFalse(PasswordPolicy.isValid("Strong1234"));
    }
}

