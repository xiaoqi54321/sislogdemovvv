// JavaScript Document

 $(function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart01'));

        // 指定图表的配置项和数据
        var option = {
	title: {
        text: '总资产类型',
		textStyle: {
		color: '#fff',
		}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'right',
		y:'bottom',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
	color:[ '#ffff14','#9fe129','#e9f3cd','#a9d035','#bedc68','#d4e79a'  ],
    series : [
        {
			
            name: '访问来源',
            type: 'pie',
            radius: ['34%', '58%'],
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle: {
                normal: {
                    
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{b}\n{c}',
                    }
                },
				
            },
        }
    ]

};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		});
		
// JavaScript Document

 $(function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart03'));

        // 指定图表的配置项和数据
        var option = {
	title: {
        text: '告警类型',
		textStyle: {
		color: '#fff',
		}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'right',
		y:'bottom',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
	color:[ '#ffff14','#9fe129','#e9f3cd','#a9d035','#bedc68','#d4e79a' ],
    series : [
        {
			
            name: '访问来源',
            type: 'pie',
            radius: ['34%', '58%'],
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle: {
                normal: {
                    
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{b}\n{c}',
                    }
                },
				
            },
        }
    ]

};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		});

//折线图01
 $(function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart02'));

        // 指定图表的配置项和数据
        var option = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ['FTP'],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
        }
    },
    grid: {
		top:'2%',
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: false
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
         axisLine : {    // 轴线
                show: false,
                
            },
        axisLabel : {
                show:true,
                margin: 0,
                textStyle: {
                    color: '#fff',
                }
            },
        splitLine : {
                show:true,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)',

                }
            },
        
        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
    }],
    yAxis: [{
        type: 'value',
        name: '单位（%）',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {
            margin: 110,
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
			show:false,
            lineStyle: {
                color: '#000'
            }
        }
    }],
    series: [{
        name: 'FTP',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 1
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255, 255, 255, 0.2)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: '#9ff32b',
                borderColor: 'rgba(255,188,2,0.27)',
                borderWidth: 12

            }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    }
        ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		});
		
//折线图02
 $(function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart04'));

        // 指定图表的配置项和数据
        var option = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ['HTTP'],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
        }
    },
    grid: {
		top:'2%',
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: false
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
         axisLine : {    // 轴线
                show: false,
                
            },
        axisLabel : {
                show:true,
                margin: 0,
                textStyle: {
                    color: '#fff',
                }
            },
        splitLine : {
                show:true,
                lineStyle: {
                    color: 'rgba(43, 237, 230, 0.2)',

                }
            },
        
        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
    }],
    yAxis: [{
        type: 'value',
        name: '单位（%）',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {
            margin: 110,
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
			show:false,
            lineStyle: {
                color: '#000'
            }
        }
    }],
    series: [{
        name: 'HTTP',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 1
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(43, 237, 230, 0.2)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(255,188,2)',
                borderColor: 'rgba(255,188,2,0.27)',
                borderWidth: 12

            }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    }
        ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		});

//折线图03
 $(function(){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('piechart05'));

        // 指定图表的配置项和数据
        var option = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ['LINK'],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
        }
    },
    grid: {
		top:'2%',
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: false
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
         axisLine : {    // 轴线
                show: false,
                
            },
        axisLabel : {
                show:true,
                margin: 0,
                textStyle: {
                    color: '#fff',
                }
            },
        splitLine : {
                show:true,
                lineStyle: {
                    color: 'rgba(43, 237, 230, 0.2)',

                }
            },
        
        data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
    }],
    yAxis: [{
        type: 'value',
        name: '单位（%）',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#000'
            }
        },
        axisLabel: {
            margin: 110,
            textStyle: {
                fontSize: 14
            }
        },
        splitLine: {
			show:false,
            lineStyle: {
                color: '#000'
            }
        }
    }],
    series: [{
        name: 'LINK',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 1
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(43, 237, 230, 0.2)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(255,188,2)',
                borderColor: 'rgba(255,188,2,0.27)',
                borderWidth: 12

            }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    }
        ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		});
		
		
		
