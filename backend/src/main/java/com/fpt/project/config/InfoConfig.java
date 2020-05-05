/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

/**
 *
 * @author Phong
 */
public class InfoConfig {

// redis
    public static final String CURRENT_TOKEN = "V_Token:%s";
    public static final String HISTORY_TOKEN = "S_TokenHistory:%d";
    public static final String USER_DATA = "H_USER_PERMISSION";
    public static final String USER_KEY = "USER_KEY";
    public static final String HASH_LOGIN = "H_LOGIN";
    public static final String RESET_TOKEN = "V_RESET_TOKEN:%s";

// slack
    @Value("${slack.webhook}")
    public static String WEBHOOK;

// role
    public static String ADMIN_ROLE = "admin";
    public static String STUDENT_ROLE = "student";
    public static String STAFF_ROLE = "staff";
    public static String AUTHORISED_STAFF_ROLE = "authorised_staff";

    public static final ObjectMapper MAPPER = new ObjectMapper();
}
