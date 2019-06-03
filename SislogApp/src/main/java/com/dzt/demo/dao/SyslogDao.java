package com.dzt.demo.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SyslogDao {

    List<Map<String, Object>> queryData();


    List list() throws Exception;

    int countSyslogList() throws Exception;
}
