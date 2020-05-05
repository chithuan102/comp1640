/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.DocumentQuery;
import com.fpt.project.model.Document;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author phong
 */
@Service
public class DocumentService {

    @Autowired
    private DocumentQuery documentQuery;

    public Document createDocument(Document document) {
        documentQuery.save(document);
        return getDocument(document.getId());
    }

    public Document updateDocument(int id, Document document) {
        Document db = getDocument(id);
        db.setTitle(document.getTitle());
        db.setContent(document.getContent());
        db.setDescription(document.getDescription());
        db.setThumbnail(document.getThumbnail());
        db.setShortDescription(document.getShortDescription());
        db.setUsername(document.getUsername());
        db.setLinkFile(document.getLinkFile());
        db.setType(document.getType());
        db.setStatus(document.isStatus());

        documentQuery.update(db);
        return getDocument(id);
    }

    public void deleteDocument(int id) {
        documentQuery.deleteById(Document.class, id);
    }

    public Document getDocument(int id) {
        return documentQuery.findById(Document.class, id);
    }

    public List<Document> getDocumentByType(String param, int page, int pageSize) {
        return documentQuery.findDocumentByParams(param, page, pageSize);
    }

    public List<Document> getAll() {
        return documentQuery.findAll(Document.class).collect(Collectors.toList());
    }

    public List<Document> findByUser(int userId) {
        return documentQuery.findByUser(userId);
    }

    public List<Document> findByUserAndType(int userId, String type) {
        return documentQuery.findByUserAndParam(userId, type);
    }
    
    
    
    public List<Document> searchBlog(String searchText) {
        return documentQuery.searchBlog(searchText);
    }

    public int countAll() {
        return documentQuery.countAll();
    }
}
