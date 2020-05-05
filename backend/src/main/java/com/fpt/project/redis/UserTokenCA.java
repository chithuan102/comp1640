/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.redis;

import static com.fpt.project.config.InfoConfig.CURRENT_TOKEN;
import java.util.Set;
import java.util.concurrent.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.*;

/**
 *
 * @author Truong Tam Phong
 */
@Component
public class UserTokenCA {

    @Autowired
    private RedisTemplate<Object, Object> template;

    public void add(String token, int uid) {
        String key = String.format(CURRENT_TOKEN, token);
        template.opsForValue().setIfAbsent(key, uid);
        template.expire(key, 7, TimeUnit.DAYS);
    }

    public int getUserId(String token) {
        String key = String.format(CURRENT_TOKEN, token);
        Integer userId = (Integer) template.opsForValue().get(key);
        return userId != null ? userId : 0;
    }

    public void deleteToken(Set<String> tokens) {
        tokens.forEach(x -> template.delete(String.format(CURRENT_TOKEN, x)));
    }
}
