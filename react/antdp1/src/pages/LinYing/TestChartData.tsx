export const TestMesObjData=

{
  "agg_id": 86265,
  "code": 0,
  "data": [
    {
      type:"bar",
      title:"堆叠柱形图",
      external:{isStack:true},
      "x_label":"label",
      "y_label":"value",
      "category": null,
      data:[
        { "name": "文科", "label": "Jan.", "value": 70,   "stackField": "语文" },
        { "name": "理科", "label": "Jan.", "value": 67,   "stackField": "数学" },
        { "name": "文科", "label": "Jan.", "value": 90.5, "stackField": "英语" },
      
        { "name": "文科", "label": "Feb.", "value": 82.5, "stackField": "语文" },
        { "name": "理科", "label": "Feb.", "value": 65.5, "stackField": "数学" },
        { "name": "文科", "label": "Feb.", "value": 79,   "stackField": "英语" },
      
        { "name": "文科", "label": "Mar.", "value": 77.5, "stackField": "英语" },
        { "name": "理科", "label": "Mar.", "value": 65.5, "stackField": "数学" },
        { "name": "文科", "label": "Mar.", "value": 72,   "stackField": "语文" },
      ]
    },
    {
      type:"group",
      title:"group",
      data:[
        {
          "category": null,
          "external":{
            "hideHeaders":["indicator"],
            "align":"align-center"
          },
          "headers": [
              "url",
              "datalake_dt_id",
              "datalake_gt_id",
          ],
          "indicators": [
            "0011fac6-0de5-11ed-a2e0-8704370fcbdc",
            "00172d3e-0f89-11ed-88bf-bf7676227f2a",
            "ee4a6776-0f40-11ed-b341-6db5cb52ba3f",
            "LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_3"
          ],
          "ranges": {},
          "title": "Details",
          "type": "antTable",
          "values": {
            LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_3:{
                  "datalake_dt_id": "0011fac6-0de5-11ed-a2e0-8704370fcbdc",
                  "datalake_gt_id": "cc570ab8-0cf5-11ed-802c-3be7fc6a7078",
                  "url": "subpage",//注意这个key对应metricid=14325
            },
            "0011fac6-0de5-11ed-a2e0-8704370fcbdc": {
                "datalake_dt_id": 'json:{"type":"tip","value":"0011fac6-0de5-11ed-a2e0-8704370fcbdc","detail":"dddddtiallksdjflajsdlfjlsda"}',
                "datalake_gt_id": 'json:{"type":"pop","value":"cc570ab8-0cf5-11ed-802c-3be7fc6a7078","title":"pop","content":"this is content of popover"}',
                "url": "subpage",
            },
            "00172d3e-0f89-11ed-88bf-bf7676227f2a": {
                "datalake_dt_id": 'json:{"type":"drawer","value":"00172d3e-0f89-11ed-88bf-bf7676227f2a","title":"drawertitle","placement":"right","size":150}',
                "datalake_gt_id": 'json:{"type":"json","value":"a75d1a14-0ee3-11ed-af49-b12a87c7864a","detail":{"A":1,"B":["2","e"],"c":{"d":4}}}',
                "url": "ddloc_reform",
            },
            "ee4a6776-0f40-11ed-b341-6db5cb52ba3f":{
              "datalake_dt_id": "00172d3e-0f89-11ed-88bf-bf7676227f2a",
              "datalake_gt_id": `json:{
                "type":"request_bokeh","name":"测试request","url":"/mes/api/internal/v2/bokeh","method":"GET",
                "params":{}
              }`,
              "url": "ddloc_reform",
            }
          },
        },
        {
          "category": null,
          "external":{ },
          "headers": [
              "url",
              "datalake_dt_id",
              "datalake_gt_id",
          ],
          "indicators": [
            "0011fac6-0de5-11ed-a2e0-8704370fcbdc1",
            "00172d3e-0f89-11ed-88bf-bf7676227f2a1",
            "ee4a6776-0f40-11ed-b341-6db5cb52ba3f1",
            "LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_31"
          ],
          "ranges": {},
          "title": "Details2",
          "type": "antTable",
          "values": {
            LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_31:{
                  "datalake_dt_id": "0011fac6-0de5-11ed-a2e0-8704370fcbdc",
                  "datalake_gt_id": "cc570ab8-0cf5-11ed-802c-3be7fc6a7078",
                  "url": "rrew",//注意这个key对应metricid=14325
            },
              "0011fac6-0de5-11ed-a2e0-8704370fcbdc1": {
                  "datalake_dt_id": 'dt id1',
                  "datalake_gt_id": 'gt id1',
                  "url": "rree",
              },
              "00172d3e-0f89-11ed-88bf-bf7676227f2a1": {
                  "datalake_dt_id": 'dtid 2',
                  "datalake_gt_id": 'gt id 2',
                  "url": "ddloc_reform",
              },
              "ee4a6776-0f40-11ed-b341-6db5cb52ba3f1":{
                "datalake_dt_id": "asdfasdf",
                "datalake_gt_id": "234234324",
                "url": "ddloc_reform",
            }
          },
        },
        {
          "x_label":"xxx",
          "y_label":"yyy",
          "category": null,
          "data": [
            {
              "color": "blue",
              "label": "position_error_lateral@1sigma",
              "value": 0.227
            },
            {
              "color": "blue",
              "label": "position_error_lateral@3sigma",
              "value": 1.78
            },
            {
              "color": "yellow",
              "label": "action-turn-position_error_lateral@1sigma",
              "value": 0.282
            }
          ],
          "title": "场景级横向误差_sigma",
          "type": "bar"
        }
      ]
    },
    {
      "category": null,
      "external": {"id_name":"首列名"},
      "headers": ["value"],
      "indicators": ["看板生成时间","覆盖总车辆数","在线标定总触发数","监控总天数","平均标定次数/天","平均标定次数/车"],
      "ranges": {},
      "title": "Devcar 看板",
      "type": "table",
      "values": {
        "在线标定总触发数": {"value": 1404},
        "平均标定次数/天": {"value": 14.62},
        "平均标定次数/车": {"value": 17.12},
        "监控总天数": {
          "value": "json:{\"type\": \"link\",\"name\":\"baidu\",\"url\":\"http://www.baidu.com\"}",
        },
        "看板生成时间": {"value": "2022-11-24 14:33:19"},
        "覆盖总车辆数": {
          "value": 'json:{"type":"node","value":"ffddss","style":{"color":"yellow"}}'
        }
      },
      "withColor": []
    },
      {
        "data": [
          {
            "data": {
              "colors": [
                {
                  "color": "#237804",
                  "label": "within_limit_3.0m",
                  "level": 50,
                  "radius": 5
                },
                {
                  "color": "#ad6800",
                  "label": "over_limit_3.0m",
                  "level": 200,
                  "radius": 5
                },
                {
                  "color": "#f5222d",
                  "label": "over_limit_3.7m",
                  "level": 200,
                  "radius": 5
                }
              ],
              "order": 2,
              "points": [
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.216248460272325,
                  "lon": 120.23047910294302,
                  "t": 1653554860.034574
                },
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.216259478264377,
                  "lon": 120.23052960427104,
                  "t": 1653554860.314577
                },
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.21626999919562,
                  "lon": 120.23058024141979,
                  "t": 1653554860.594578
                },
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.216279773669314,
                  "lon": 120.23063029663918,
                  "t": 1653554860.874585
                }
              ]
            },
            "func": "[dt_source-predictor]GLOBAL_LATERAL_POSITION_ERROR_TRAJECTORY",
            "select_type": "dt_source-predictor",
            "tips": [
              "lon",
              "lat",
              "t",
              "label",
              "link"
            ]
          },
          {
            "data": {
              "colors": [
                {
                  "color": "#237804",
                  "label": "within_limit_3.0m",
                  "level": 50,
                  "radius": 5
                },
                {
                  "color": "#ad6800",
                  "label": "over_limit_3.0m",
                  "level": 200,
                  "radius": 5
                },
                {
                  "color": "#f5222d",
                  "label": "over_limit_3.7m",
                  "level": 200,
                  "radius": 5
                }
              ],
              "order": 1,
              "points": [
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.214882666618216,
                  "lon": 120.22746797929649,
                  "t": 1653554842.204391
                },
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.214891492617298,
                  "lon": 120.22748405858265,
                  "t": 1653554842.304392
                },
                {
                  "label": "within_limit_3.0m",
                  "lat": 30.214900289638553,
                  "lon": 120.22750012190664,
                  "t": 1653554842.404394
                }
              ]
            },
            "func": "[dt_source-filter]GLOBAL_LATERAL_POSITION_ERROR_TRAJECTORY",
            "select_type": "dt_source-filter",
            "tips": [
              "lon",
              "lat",
              "t",
              "label",
              "link"
            ]
          }
        ],
        "map_title": "DDLOC_TRAJ",
        "type": "map"
      },
      {
          "category": null,
          "external":{
              "filters":{
                "filter_type":"dt_source-filter",
                "visual_type":"线路级MPD"
              },
              "sortHeaders":["weight"],
              "hideHeaders":["Dataset"],
              "styleHeaders":["indicator","\u8bef\u5dee\u8d85\u9650","datalake_gt_id"],
              "noPagination":true,
              "singleSearch":true,
              "buttons":[{"name":"mviz","method":"GET","params":{"b":1},"url":"/a","type":"primary","action":"request"}],
              // "align":"align-left",
              "searchInput":["datalake_dt_id"]
          },
          "headers": [
              "url",
              "datalake_dt_id",
              "datalake_gt_id",
              "\u8f66\u8f86",
              "\u8bef\u5dee\u8d85\u9650",
              "Dataset",
              "weight"
          ],
          "indicators": [
            "0011fac6-0de5-11ed-a2e0-8704370fcbdc",
            "00172d3e-0f89-11ed-88bf-bf7676227f2a",
            "ee4a6776-0f40-11ed-b341-6db5cb52ba3f",
            "LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_3"
          ],
          "ranges": {},
          "searchRange": ["\u8f66\u8f86"],
          "searchSelect": [
              "\u8f66\u8f86",
              "\u57ce\u5e02",
              "\u8bef\u5dee\u8d85\u9650"
          ],
          "title": "Details",
          "type": "antTable",
          "values": {
            LOCALIZATION_STATUS_DEGRADE_TO_3_LOCALIZATION_STATUS_DEGRADE_TO_3:{
              "Dataset": "PLAAG3921_recording_calib_sfm_recording_20220723-141847",
                  "datalake_dt_id": "0011fac6-0de5-11ed-a2e0-8704370fcbdc",
                  "datalake_gt_id": "cc570ab8-0cf5-11ed-802c-3be7fc6a7078",
                  "url": "subpage",//注意这个key对应metricid=14325
                  "\u8bef\u5dee\u8d85\u9650": "\u65e0\u6570\u636e",
                  "style":{
                      "datalake_gt_id":{"color":"red","backgroundColor":"#12feb1"},
                      "\u8bef\u5dee\u8d85\u9650":{"color":"blue","backgroundColor":"#f2feb1"}
                  },
                  "weight":2
            },
              "0011fac6-0de5-11ed-a2e0-8704370fcbdc": {
                  "Dataset": "PLAAG3921_recording_calib_sfm_recording_20220723-141847",
                  "datalake_dt_id": 'json:{"type":"tip","value":"0011fac6-0de5-11ed-a2e0-8704370fcbdc","detail":"dddddtiallksdjflajsdlfjlsda"}',
                  "datalake_gt_id": 'json:{"type":"pop","value":"cc570ab8-0cf5-11ed-802c-3be7fc6a7078","title":"pop","content":"this is content of popover"}',
                  "url": "subpage",
                  "\u8bef\u5dee\u8d85\u9650": "\u65e0\u6570\u636e",
                  "style":{
                      "datalake_gt_id":{"color":"red","backgroundColor":"#12feb1"},
                      "\u8bef\u5dee\u8d85\u9650":{"color":"blue","backgroundColor":"#f2feb1"}
                  },
                  "weight":2
              },
              "00172d3e-0f89-11ed-88bf-bf7676227f2a": {
                  "Dataset": "PLAA76350_recording_calib_sfm_recording_20220723-172518",
                  "datalake_dt_id": 'json:{"type":"drawer","value":"00172d3e-0f89-11ed-88bf-bf7676227f2a","title":"drawertitle","placement":"right","size":150}',
                  "datalake_gt_id": 'json:{"type":"json","value":"a75d1a14-0ee3-11ed-af49-b12a87c7864a","detail":{"A":1,"B":["2","e"],"c":{"d":4}}}',
                  "url": "ddloc_reform",
                  "\u8bef\u5dee\u8d85\u9650": "\u65e0\u6570\u636e\u636e",
                  "\u8f66\u8f86": "EP33L_AA76350",
                  "weight":3
              },"ee4a6776-0f40-11ed-b341-6db5cb52ba3f":{
                "Dataset": "PLAA76350_recording_calib_sfm_recording_20220723-172518",
                "datalake_dt_id": "00172d3e-0f89-11ed-88bf-bf7676227f2a",
                "datalake_gt_id": "a75d1a14-0ee3-11ed-af49-b12a87c7864a",
                "url": "ddloc_reform",
                "\u8bef\u5dee\u8d85\u9650": "\u65e0\u6570\u636e",
                "\u8f66\u8f86": "EP33L_AA76350",
                "weight":1
            }
          },
          "withColor": []
      },
      {
        "category": null,
        "type":"s2table"
      }
  ],
  "message": "Success.",
  "meta": {
      "agg_id": 86265,
      "ctime": "Tue, 02 Aug 2022 15:35:49 GMT",
      "finish_time": "Tue, 02 Aug 2022 15:44:24 GMT",
      "host": "CEDEV",
      "metric.metric_id": 11530, //14325
      "metric_id": 11530,
      "metric_token": "330663b4123511ed995e66dde942625a",
      "ori_query": "{}",
      "param_id": -1,
      "query": "{}",
      "query_md5": "99914b932bd37a50b983c5e7c90ae93b",
      "start_time": "Tue, 02 Aug 2022 15:43:55 GMT",
      "status": 4,
      "strategy_id": 624
  },
  "status": 4
}

// TestMesObjData.data=[TestMesObjData.data[1]]