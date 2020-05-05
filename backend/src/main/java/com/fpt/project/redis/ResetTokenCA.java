/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.redis;

import static com.fpt.project.config.InfoConfig.RESET_TOKEN;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 *
 * @author Phong
 */
@Component
public class ResetTokenCA {

    @Autowired
    private RedisTemplate<String, String> template;

    public void add(int resetToken, String email) {
        String key = String.format(RESET_TOKEN, resetToken);
        template.opsForValue().setIfAbsent(key, email);
        template.expire(key, 6, TimeUnit.HOURS);
    }

    public boolean isValidToken(int resetToken, String email) {
        String key = String.format(RESET_TOKEN, resetToken);
        if (((String) template.opsForValue().get(key)).equals(email)) {
            template.delete(key);
            return true;
        }
        return false;
    }
}
