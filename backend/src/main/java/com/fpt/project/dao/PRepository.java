/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dao;

import com.fpt.project.model.BaseModel;
import io.ebean.EbeanServer;
import io.ebean.Query;
import io.ebean.annotation.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Phong
 */
@Repository
public class PRepository {

    @Autowired
    private EbeanServer server;

    public <T extends BaseModel> Stream<T> findAll(Class<T> clazz) {
        return server.find(clazz).findList().stream();
    }

    public <T extends BaseModel> T findById(Class<T> clazz, long id) {
        return server.find(clazz, id);
    }

    public <T extends BaseModel> T findOneBy(Class<T> clazz, String column, Object val) {
        return server.find(clazz).where().eq(column, val).findOne();
    }

    public <T extends BaseModel> Query<T> query(Class<T> clazz) {
        return server.find(clazz);
    }

    @Transactional
    public <T extends BaseModel> void save(T bean) {
        server.save(bean);
    }

    @Transactional
    public <T extends BaseModel> void update(T bean) {
        server.update(bean);
    }

    @Transactional
    public <T extends BaseModel> void saveAll(Collection<T> beans) {
        server.saveAll(beans);
    }

    @Transactional
    public <T extends BaseModel> void delete(T bean) {
        server.delete(bean);
    }

    @Transactional
    public <T extends BaseModel> void deleteById(Class<T> clazz, long id) {
        server.delete(clazz, id);
    }

    @Transactional
    public <T extends BaseModel> void deleteAll(Collection<T> beans) {
        server.deleteAll(beans);
    }

    @Transactional
    public <T extends BaseModel> void deleteAllById(Class<T> clazz, List<Long> ids) {
        server.deleteAll(clazz, ids);
    }

    public <T extends BaseModel> Query<T> findNative(Class<T> clazz, String query) {
        return server.findNative(clazz, query);
    }
}
