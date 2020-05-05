package com.fpt.project.constant;

import java.util.*;
import org.springframework.http.*;

public enum ErrorCode {

    NONE(0),
    OAUTH(HttpStatus.UNAUTHORIZED.value()),
    PERMISSION_DENY(HttpStatus.FORBIDDEN.value()),
    NOT_FOUND(HttpStatus.NOT_FOUND.value()),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR.value()),
    NOTFOUND(HttpStatus.NOT_FOUND.value()),
    PARAMETER_INVALID(1000),
    ACCESS_TOKEN_IS_EXPIRED(1001),
    USER_INVALID(1002),
    PROJECT_INVALID(1003),
    STORE_INVALID(1004),
    DUPLICATE(1010),
    REACH_LIMITATION(1011),
    LOCKED(1012);

    private int value;

    ErrorCode(int value) {
        this.value = value;
    }

    public static ErrorCode valueOf(int value) {
        return Arrays.stream(ErrorCode.values()).filter(v -> v.value == value).findFirst().orElse(NONE);
    }

    public int getValue() {
        return value;
    }
}
