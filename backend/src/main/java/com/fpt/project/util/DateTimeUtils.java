/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.util;

import java.text.SimpleDateFormat;

/**
 *
 * @author Phong
 */
public class DateTimeUtils {

    static final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

    public static String getNow(String format) {
        return toString(new java.util.Date(), format);
    }

    public static String toString(java.util.Date dt, String format) {
        try {
            formatter.applyPattern(format);
            return formatter.format(dt);
        } catch (Exception e) {
        }
        return null;
    }
}
