/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dao;

import com.fpt.project.model.User;
import io.ebean.Expr;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Phong
 */
@Repository
public class UserQuery extends PRepository {

    public User findByEmail(String username) {
        return query(User.class).where().eq("email", username).findOne();
    }

    public List<User> findMultiByEmail(String email) {
        return query(User.class).where().contains("email", email).findList();
    }

    public List<User> findByRole(String role) {
        return query(User.class).where().eq("role", role).findList();
    }

    public List<User> findByTutor(int tutorId) {
        return query(User.class).where().eq("tutor_id", tutorId).findList();
    }

    public int countAll() {
        return query(User.class).where().findCount();
    }

    public int countByTutor(int tutorId) {
        return query(User.class).where().eq("tutor_id", tutorId).findCount();
    }

    public int countByRole(String role) {
            return query(User.class).where().eq("role", role).findCount();
    }
    
    public int countByRoleSearchText(String role,String searchText) {
            return query(User.class).where().eq("role", role).like("full_name",searchText).or().like("email", searchText).findCount();
    }

    public int countByEmail(String email) {
        return query(User.class).where().contains("email", email).findCount();
    }

    public int countByFullName(String fullName) {
        return query(User.class).where().contains("full_name", fullName).findCount();
    }

    public List<User> findAllPaging(int page, int pageSize) {
        return query(User.class).where()
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByRolePaging(String role, int page, int pageSize) {
        return query(User.class).where().eq("role", role)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }
    
     public List<User> findByRolePagingSearchText(String role, int page, int pageSize,String searchText) {
        return query(User.class).where().eq("role", role).or(Expr.like("full_name","%"+searchText+"%"),Expr.like("email","%"+searchText+"%"))
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByEmailPaging(String email, int page, int pageSize) {
        return query(User.class).where().contains("email", email)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByFullNamePaging(String fullName, int page, int pageSize) {
        return query(User.class).where().contains("full_name", fullName)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByTutorPaging(int tutorId, int page, int pageSize) {
        return query(User.class).where().eq("tutor_id", tutorId)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByIds(List<Integer> integers) {
        return query(User.class).where().idIn(integers)
                .findList();
    }

    public List<User> findByRoleWithoutTutorPaging(String role, int page, int pageSize) {
        return query(User.class).where().eq("role", role).eq("tutor_id", null)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public List<User> findByRoleByDateActivePaging(String role, int page, int pageSize, Date lastActiveDate) {
        return query(User.class).where()
                .eq("role", role)
                .le("last_active_date", lastActiveDate)
                .orderBy("last_active_date desc")
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }

    public int countByRoleByDateActivePaging(String role, int page, int pageSize, Date lastActiveDate) {
        return query(User.class).where()
                .eq("role", role)
                .le("last_active_date", lastActiveDate)
                .orderBy("last_active_date desc")
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findCount();
    }

    public int countByRoleWithoutTutorPaging(String role, int page, int pageSize) {
        return query(User.class).where().eq("role", role).eq("tutor_id", null)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findCount();
    }

}
