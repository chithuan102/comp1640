/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.model;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 *
 * @author mct
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMail {
    String email;
    String text;
}
