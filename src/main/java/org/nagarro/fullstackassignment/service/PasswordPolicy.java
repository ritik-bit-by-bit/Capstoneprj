package org.nagarro.fullstackassignment.service;

import java.util.regex.Pattern;

public final class PasswordPolicy {

    private static final Pattern COMPLEXITY =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$");

    private PasswordPolicy() {
    }

    public static boolean isValid(String value) {
        return value != null && COMPLEXITY.matcher(value).matches();
    }
}

