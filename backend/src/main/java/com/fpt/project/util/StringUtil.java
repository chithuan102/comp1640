/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.util;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;

/**
 *
 * @author Phong
 */
public class StringUtil {

    public static String generateToken() {
        return DigestUtils.md5Hex(String.valueOf(System.currentTimeMillis()));
    }

    public static String generatePassword() {
        String generatedString = RandomStringUtils.randomAlphabetic(6);
        return generatedString;
    }

    public static String hashPassword(String password) {
        return DigestUtils.md5Hex(password);
    }
}
