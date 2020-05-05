/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.redis;

import static com.fpt.project.config.InfoConfig.HASH_LOGIN;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 *
 * @author Truong Tam Phong
 */
@Component
public class UserLoginCA {

    @Autowired
    private RedisTemplate<Object, Object> template;

    public void add(String socialId, int uid) {
        template.opsForHash().put(HASH_LOGIN, socialId, uid);
    }

    public boolean isExist(String username) {
        return template.opsForHash().entries(HASH_LOGIN).get(username) != null;
    }

    public void updateUser(String username, int uid) {
        template.opsForHash().put(HASH_LOGIN, username, uid);
    }

    public int getUid(String username) {
        Object id = template.opsForHash().get(HASH_LOGIN, username);
        return id != null ? (int) id : 0;
    }

    public void delete(String socialId) {
        template.opsForHash().delete(HASH_LOGIN, socialId);
    }
}
