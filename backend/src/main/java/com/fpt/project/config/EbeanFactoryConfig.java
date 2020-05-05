/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.config;

import com.fpt.project.model.BaseModel;
import com.fpt.project.model.BasePermission;
import com.fpt.project.model.Comment;
import com.fpt.project.model.Department;
import com.fpt.project.model.Document;
import com.fpt.project.model.GroupPermission;
import com.fpt.project.model.Meeting;
import com.fpt.project.model.Permission;
import com.fpt.project.model.User;
import io.ebean.EbeanServer;
import io.ebean.EbeanServerFactory;
import io.ebean.config.ServerConfig;
import java.util.Properties;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 *
 * @author Phong
 */
@Component
public class EbeanFactoryConfig implements FactoryBean<EbeanServer> {

    @Value("${ebean.generate}")
    private String ebean_generate;

    @Value("${ebean.run}")
    private String ebean_run;

    @Value("${ebean.db_username}")
    private String ebean_username;

    @Value("${ebean.db_password}")
    private String ebean_password;

    @Value("${ebean.db_url}")
    private String ebean_url;

    @Value("${ebean.db_driver}")
    private String ebean_driver;

    @Value("${ebean.package}")
    private String ebean_ent_package;

    @Override
    public EbeanServer getObject() throws Exception {
        ServerConfig cfg = new ServerConfig();
        Properties properties = new Properties();
        properties.put("ebean.db.ddl.generate", ebean_generate);
        properties.put("ebean.db.ddl.run", ebean_run);
        properties.put("datasource.db.username", ebean_username);
        properties.put("datasource.db.password", ebean_password);
        properties.put("datasource.db.databaseUrl", ebean_url);
        properties.put("datasource.db.databaseDriver", ebean_driver);
        properties.put("ebean.search.packages", ebean_ent_package);
        cfg.loadFromProperties(properties);

        cfg.addClass(BaseModel.class);
        cfg.addClass(Department.class);
        cfg.addClass(User.class);
        cfg.addClass(GroupPermission.class);
        cfg.addClass(Permission.class);
        cfg.addClass(BasePermission.class);
        cfg.addClass(Comment.class);
        cfg.addClass(Document.class);
        cfg.addClass(Meeting.class);

        return EbeanServerFactory.create(cfg);
    }

    @Override
    public Class<?> getObjectType() {
        return EbeanServer.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
