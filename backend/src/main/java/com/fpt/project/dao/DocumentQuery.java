/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.dao;

import com.fpt.project.model.Document;
import io.ebean.Expr;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Phong
 */
@Repository
public class DocumentQuery extends PRepository {

    public List<Document> findByUser(int userId) {
        return query(Document.class).where().eq("user_id", userId).findList();
    }
    
      public List<Document> findByUserAndParam(int userId,String type) {
      return query(Document.class).where().eq("user_id", userId).eq("type", type).findList();
    }
    
    public List<Document> findDocumentByParams(String param, int page, int pageSize) {
        return query(Document.class).where().eq("type", param)
                .setFirstRow((page - 1) * pageSize).setMaxRows(pageSize)
                .findList();
    }
    
    public List<Document> searchBlog(String searchText) {
        return query(Document.class).where().eq("type", "BLOG").or(Expr.like("title","%"+searchText+"%"),Expr.like("username","%"+searchText+"%"))
                .findList();
    }
    
     public int countAll() {
        return query(Document.class).where().findCount();
    }
}
