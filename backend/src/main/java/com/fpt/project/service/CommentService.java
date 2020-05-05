/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fpt.project.service;

import com.fpt.project.dao.PRepository;
import com.fpt.project.model.Comment;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 *
 * @author phong
 */
@Service
public class CommentService {

    @Autowired
    @Qualifier("PRepository")
    private PRepository pRepository;

    public Comment createComment(Comment blog) {
        pRepository.save(blog);
        return getComment(blog.getId());
    }

    public Comment updateComment(int id, Comment blog) {
        Comment db = getComment(id);

        db.setName(blog.getName());
        db.setContent(blog.getContent());

        pRepository.update(db);
        return getComment(id);
    }

    public void deleteComment(int id) {
        pRepository.deleteById(Comment.class, id);
    }

    public Comment getComment(int id) {
        return pRepository.findById(Comment.class, id);
    }

    public List<Comment> getAll() {
        return pRepository.findAll(Comment.class).collect(Collectors.toList());
    }

}
