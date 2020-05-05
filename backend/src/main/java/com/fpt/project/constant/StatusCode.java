package com.fpt.project.constant;

import java.util.*;
import org.springframework.http.*;

public enum StatusCode {
    SUCCESS(HttpStatus.OK.value()),
    FAILED(HttpStatus.NOT_EXTENDED.value());

    private int value;

    StatusCode(int value) {
        this.value = value;
    }

    public static StatusCode valueOf(int value) {
        return Arrays.stream(StatusCode.values())
                .filter(v -> v.value == value).findFirst().orElse(null);
    }

    public int getValue() {
        return value;
    }
}
