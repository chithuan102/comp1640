package com.fpt.project.redis;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import static com.fpt.project.config.InfoConfig.HISTORY_TOKEN;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 *
 * @author Truong Tam Phong
 */
@Component
public class UserHistoryTokenCA {

    @Autowired
    private RedisTemplate<Object, Object> template;

    public void add(int uid, String... token) {
        String key = String.format(HISTORY_TOKEN, uid);
        template.opsForSet().add(key, token);
    }

    public Set<String> getToken(int uid) {
        String key = String.format(HISTORY_TOKEN, uid);
        return template.opsForSet().members(key).stream()
                .map(object -> Objects.toString(object, null))
                .collect(Collectors.toSet());
    }

    public void deleteToken(int uid) {
        String key = String.format(HISTORY_TOKEN, uid);
        template.opsForSet().pop(key);
    }
}
