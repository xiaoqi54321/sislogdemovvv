package com.dzt.demo.service.impl;

import com.dzt.demo.dao.SyslogDao;
import com.dzt.demo.service.SyslogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SyslogServiceImpl implements SyslogService {

    @Autowired
    private SyslogDao syslogDao;

    @Override
    public List<Map<String, Object>> queryData() {
        List<Map<String, Object>> list= syslogDao.queryData();
        return list;
    }

    @Override
    public Map<String, Object> list() throws Exception {
        Map<String, Object> lists =new HashMap<String, Object>();
       List syslogList= syslogDao.list();
       int total= syslogDao.countSyslogList();
        lists.put("data",syslogList);
        lists.put("total",total);
        lists.put("count",total);
        lists.put("code",0);
        lists.put("msg","");
        return lists;
    }
}
