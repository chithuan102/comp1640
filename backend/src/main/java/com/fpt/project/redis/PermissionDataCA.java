/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.redis;

import static com.fpt.project.config.InfoConfig.USER_DATA;
import com.fpt.project.dto.GroupPermissionDTO;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 *
 * @author Truong Tam Phong
 */
@Component
public class PermissionDataCA {

    @Autowired
    private RedisTemplate<Object, Object> redisTemplate;

    public boolean insert(int uid, GroupPermissionDTO groupPermissionDTO) {
        return redisTemplate.opsForHash().putIfAbsent(USER_DATA, uid, groupPermissionDTO);
    }

    public void update(int uid, GroupPermissionDTO groupPermissionDTO) {
        redisTemplate.opsForHash().put(USER_DATA, uid, groupPermissionDTO);
    }

    public void delete(int uid) {
        redisTemplate.opsForHash().delete(USER_DATA, uid);
    }

    public GroupPermissionDTO get(int uid) {
        return (GroupPermissionDTO) redisTemplate.opsForHash().get(USER_DATA, uid);
    }

    public void insert(Map<Integer, GroupPermissionDTO> map) {
        redisTemplate.opsForHash().putAll(USER_DATA, map);
    }
}
