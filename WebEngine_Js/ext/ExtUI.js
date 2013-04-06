Ext.define('Mty.view.ControlMainWindow', {
    extend:'Ext.panel.Panel',

    frame:true,
    height:652,
    id:'ExtControlMainWindow',
    width:1200,
    layout:{
        type:'absolute'
    },
    hideCollapseTool:false,
    title:'WebEngine',
    titleCollapse:false,

    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    frame:true,
                    height:25,
                    items:[
                        {
                            xtype:'tbseparator'
                        },
                        /*
                         {
                         xtype:'button',
                         text:'环境编辑器',
                         menu:{
                         xtype:'menu',
                         items:[
                         {
                         xtype:'menuitem',
                         handler:function (item, event) {
                         if (null == global_extPanelManager.m_oEnvirEditorObj) {
                         global_extPanelManager.m_oEnvirEditorObj = new EnvirEditorObj();
                         global_extPanelManager.m_oEnvirEditorObj.init();
                         } else {
                         global_extPanelManager.m_oEnvirEditorObj.setMenuShow();
                         }
                         },
                         text:'地形工具'
                         },
                         {
                         xtype:'menuitem',
                         text:'光照工具'
                         }
                         ]
                         }
                         },
                         */
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                global_extPanelManager.m_oEntiLocalIOPlugin.setMenuShow();
                            },
                            text:'本地载入'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        /*
                         {
                         xtype:'button',
                         text:'粒子编辑器'
                         },
                         */
                        {
                            xtype:'tbfill'
                        },
                        {
                            xtype:'tbseparator'
                        }
                    ]
                },
                {
                    xtype:'toolbar',
                    dock:'bottom',
                    frame:true,
                    height:25,
                    id:'',
                    items:[
                        {
                            xtype:'button',
                            handler:function (button, event) {

                                //Ext.MessageBox.alert('提示',"I'm ready to show u a new world! :-)");
                                event_createNewWorld();
                            },
                            icon:'media/ico/window.png',
                            text:'新建'
                        },
                        {
                            xtype:'button',
                            text:'打开'
                        },
                        {
                            xtype:'button',
                            text:'保存'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        /*
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
                                usrOpr.m_oCurOperaMod.clearAll();
                                usrOpr.m_oCurOperaMod = usrOpr.m_oMoveCamObj;
                            },
                            text:'Move'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
                                usrOpr.m_oCurOperaMod.clearAll();
                                usrOpr.m_oCurOperaMod = usrOpr.m_oEntiOperaObj;
                            },
                            text:'Select'
                        },
                        */
                        {
                            xtype:'tbfill'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'textareafield',
                            width:150,
                            inputId:'id_eye_world',
                            name:'eye_world',
                            fieldLabel:'eye',
                            labelWidth:20,
                            emptyText:'-',
                            growAppend:' -'
                        },
                        {
                            xtype:'textareafield',
                            width:150,
                            inputId:'id_to_world',
                            name:'to_world',
                            fieldLabel:'to',
                            labelWidth:20,
                            emptyText:'-'
                        },
                        {
                            xtype:'textareafield',
                            width:150,
                            inputId:'id_up_world',
                            name:'up_world',
                            fieldLabel:'up',
                            labelWidth:20,
                            emptyText:'-'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            handler:function () {
                                global_extPanelManager.getMainWindowObj().m_oBaseOprMenu.setMenuShow();
                            },
                            text:'观察者'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            handler:function () {
                                global_extPanelManager.m_oRenderConfPlugin.setMenuShow();
                            },
                            text:'渲染配置'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.define('Mty.view.BaseOprMenu', {
    extend:'Ext.panel.Panel',

    height: 54,
    width: 400,
    title: '#',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            //icon: 'media/ico/mov_space.jpg',
                            text: 'Move',
                            handler:function (button, event) {
                                var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
                                usrOpr.m_oCurOperaMod.clearAll();
                                usrOpr.m_oCurOperaMod = usrOpr.m_oMoveCamObj;
                            }
                        },
                        {

                        },
                        {
                            xtype: 'button',
                            //icon: 'media/ico/tip_enti.jpg',
                            text: 'Tip',
                            handler:function (button, event) {
                                var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
                                usrOpr.m_oCurOperaMod.clearAll();
                                usrOpr.m_oCurOperaMod = usrOpr.m_oEntiOperaObj;
                            }
                        }
                    ]
                }
            ],
            tools: [
                {
                    xtype: 'tool',
                    type: 'close',
                    handler:function(){global_extPanelManager.getMainWindowObj().m_oBaseOprMenu.setMenuHide();}
                }
            ]
        });

        me.callParent(arguments);
    }
});

Ext.define('Mty.view.sletMenu', {
    extend:'Ext.panel.Panel',

    draggable:true,
    height:25,
    width:174,
    title:'',

    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    height:25,
                    width:159,
                    items:[
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj.m_iOprCodec = 0x00000000;
                            },
                            text:'移动'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj.m_iOprCodec = 0x00000001;
                            },
                            text:'缩放'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj.m_iOprCodec = 0x00000002;
                            },
                            text:'旋转'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
//                                global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oSglEntiOperaObj.sletBoundingBoxDesty();
                                global_extPanelManager.getMainWindowObj().sletEntiOperaMenuHide();
                                global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oEntiOperaObj.clearAll();
                            },
                            text:'取消'
                        },
                        {
                            xtype:'tbseparator'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.define('Mty.view.crtNewProj', {
    extend: 'Ext.panel.Panel',

    height: 250,
    width: 400,
    layout: {
        type: 'absolute'
    },
    title: '新建工程',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            tools:[
                {
                    xtype:'tool',
                    id:'btCloseWin_crtNewProj',
                    tooltip:'关闭',
                    handler:function () {
                        global_extPanelManager.getMainWindowObj().m_oCrtNewProj.setMenuHide();
                    },
                    type:'close'
                }
            ],
            items: [
                {
                    xtype: 'textfield',
                    x: 70,
                    y: 70,
                    id: 'id_newProj_name',
                    width: 220,
                    fieldLabel: '工程名',
                    labelWidth: 50
                },
                {
                    xtype: 'button',
                    handler: function(button, event) {
                        var strInProjName = Ext.getCmp('id_newProj_name').getValue().toString();
                        global_oakEngineManager.getMainEngineObject().m_oInitWorldConf.m_strProjName = strInProjName;
                        createNewWorld(global_oakEngineManager.getMainEngineObject().getInitWorldConfData());
                        global_extPanelManager.m_oRenderConfPlugin.addCurScene2UiItem();
                        global_extPanelManager.getMainWindowObj().m_oCrtNewProj.setMenuHide();
                    },
                    x: 160,
                    y: 120,
                    height: 30,
                    width: 70,
                    text: '创建'
                }
            ]
        });

        me.callParent(arguments);
    }

});

Ext.define('Mty.view.Render_Cam_Conf', {
    extend:'Ext.panel.Panel',

    height:600,
    id:'id_renderConf',
    width:300,
    autoScroll:true,
    draggable:true,
    layout:{
        type:'column'
    },
    title:'渲染配置',

    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            tools:[
                {
                    xtype:'tool',
                    tooltip:'关闭插件',
                    type:'close',
                    handler:function () {
                        global_extPanelManager.m_oRenderConfPlugin.setMenuHide();
                    }
                }
            ],
            items:[
                {
                    xtype:'panel',
                    baseCls:'baseCls:\'.my-panel-no-border{border-style:none}\'',
                    height:170,
                    width:326,
                    title:'',
                    items:[
                        {
                            xtype:'fieldset',
                            height:150,
                            width:313,
                            title:'工程列表',
                            id:'id_sceneList',
                            draggable:true
                        }
                    ]
                },
                {
                    shrinkWrap:1
                },
                {
                    xtype:'panel',
                    baseCls:'baseCls:\'.my-panel-no-border{border-style:none}\'',
                    height:170,
                    layout:{
                        type:'column'
                    },
                    title:'',
                    items:[
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                if (false == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
                                    return;
                                }
                                var curCam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
                                global_extPanelManager.m_oRenderConfPlugin.addCam(curCam);
                            },
                            id:'id_renderConf_addCamBtn',
                            width:36,
                            text:'+'
                        },
                        {
                            xtype:'textfield',
                            width:144,
                            inputId:'id_renderConf_camName',
                            fieldLabel:'新建观察点',
                            labelWidth:70
                        },
                        {
                            xtype:'fieldset',
                            height:140,
                            id:'id_camItemSet',
                            width:326,
                            autoScroll:true,
                            layout:{
                                type:'column'
                            },
                            title:'相机列表'
                        }
                    ]
                },
                {

                },
                /*
                 {
                 xtype: 'panel',
                 baseCls: 'baseCls:\'.my-panel-no-border{border-style:none}\'',
                 height: 198,
                 width: 308,
                 layout: {
                 type: 'column'
                 },
                 title: '',
                 items: [
                 {
                 xtype: 'checkboxfield',
                 width: 200,
                 fieldLabel: '雾化',
                 labelWidth: 40,
                 boxLabel: '',
                 id:'id_fog_checkBox'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fog_density',
                 width: 255,
                 fieldLabel: '稠密因子'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fog_near',
                 fieldLabel: 'Near dist'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fog_far',
                 fieldLabel: 'Far dist'
                 },
                 {
                 xtype: 'label',
                 width: 275,
                 text: '雾霭色：'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fogColor_r',
                 fieldLabel: 'R'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fogColor_g',
                 fieldLabel: 'G'
                 },
                 {
                 xtype: 'textfield',
                 id: 'id_fogColor_b',
                 fieldLabel: 'B'
                 },
                 {
                 xtype: 'button',
                 handler: function(button, event) {
                 var pluginObj = global_extPanelManager.m_oRenderConfPlugin;
                 pluginObj.setFogConf_ext();
                 },
                 width: 56,
                 text: '设置'
                 }
                 ]
                 },
                 */
                {

                },
                {
                    xtype:'panel',
                    baseCls:'baseCls:\'.my-panel-no-border{border-style:none}\'',
                    height:150,
                    width:326,
                    layout:{
                        type:'column'
                    },
                    title:'',
                    items:[
                        {
                            xtype:'panel',
                            baseCls:'\'.my-panel-no-border{border-style:none}\'',
                            height:23,
                            width:303,
                            title:'',
                            items:[
                                {
                                    xtype:'label',
                                    height:14,
                                    width:317,
                                    text:'-相机配置-'
                                }
                            ]
                        },
                        /*
                         {
                         xtype: 'textfield',
                         width: 84,
                         fieldLabel: '视角',
                         listeners :{
                         change:function(field,newValue,oldValue){
                         global_extPanelManager.m_oRenderConfPlugin.setFov_ext(newValue);
                         }
                         },
                         labelWidth: 30
                         },
                         */
                        {
                            xtype:'panel',
                            baseCls:'baseCls:\'.my-panel-no-border{border-style:none}\'',
                            height:25,
                            width:312,
                            title:'',
                            items:[
                                {
                                    fieldLabel:'视角',
                                    xtype:'slider',
                                    width:220,
                                    value:90,
                                    minValue:1,
                                    maxValue:179,
                                    labelWidth:50,

                                    listeners:{
                                        'beforechange':function (slider, newValue, oldValue) {
                                            //alert("newValue:" + newValue + " oldValue:" + oldValue);
                                            global_extPanelManager.m_oRenderConfPlugin.setFov_ext(newValue);
                                        }
                                    }
                                }
                            ]
                        },
                        /*
                         {
                         xtype: 'textfield',
                         width: 88,
                         fieldLabel: '位置:',
                         labelWidth: 30
                         },*/
                        {

                        },
                        {
                            xtype:'panel',
                            baseCls:'baseCls:\'.my-panel-no-border{border-style:none}\'',
                            height:130,
                            width:312,
                            title:'',
                            items:[
                                {
                                    xtype:'label',
                                    height:21,
                                    width:237,
                                    text:'背景色：'
                                },
                                {
                                    id:'id_slider_camColor_r',
                                    xtype:'slider',
                                    //inputId: '',
                                    fieldLabel:'R',
                                    width:220,
                                    value:90,
                                    minValue:0,
                                    maxValue:255,
                                    labelWidth:50,
                                    listeners:{
                                        'beforechange':function (slider, newValue, oldValue) {
                                            //alert("newValue:" + newValue + " oldValue:" + oldValue);
                                            global_extPanelManager.m_oRenderConfPlugin.setBackColor_ext();
                                        }
                                    }
                                },
                                {
                                    id:'id_slider_camColor_g',
                                    xtype:'slider',
                                    //inputId: '',
                                    fieldLabel:'G',
                                    width:220,
                                    value:90,
                                    minValue:0,
                                    maxValue:255,
                                    labelWidth:50,
                                    listeners:{
                                        'beforechange':function (slider, newValue, oldValue) {
                                            //alert("newValue:" + newValue + " oldValue:" + oldValue);
                                            global_extPanelManager.m_oRenderConfPlugin.setBackColor_ext();
                                        }
                                    }
                                },
                                {
                                    id:'id_slider_camColor_b',
                                    xtype:'slider',
                                    //inputId: '',
                                    fieldLabel:'B',
                                    width:220,
                                    value:90,
                                    minValue:0,
                                    maxValue:255,
                                    labelWidth:50,
                                    listeners:{
                                        'beforechange':function (slider, newValue, oldValue) {
                                            //alert("newValue:" + newValue + " oldValue:" + oldValue);
                                            global_extPanelManager.m_oRenderConfPlugin.setBackColor_ext();
                                        }
                                    }
                                },
                                {
                                    id:'id_slider_camColor_a',
                                    xtype:'slider',
                                    //inputId: '',
                                    fieldLabel:'A',
                                    width:220,
                                    value:255,
                                    minValue:0,
                                    maxValue:255,
                                    labelWidth:50,
                                    listeners:{
                                        'beforechange':function (slider, newValue, oldValue) {
                                            //alert("newValue:" + newValue + " oldValue:" + oldValue);
                                            global_extPanelManager.m_oRenderConfPlugin.setBackColor_ext();
                                        }
                                    }
                                }
                                /*
                                 {
                                 xtype: 'button',
                                 handler: function(button, event) {
                                 var pluginObj = global_extPanelManager.m_oRenderConfPlugin;
                                 pluginObj.setBackColor_ext();
                                 },
                                 text: '设置'
                                 }
                                 */
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});

Ext.define('Mty.view.EntiMgrPanel', {
    extend:'Ext.tree.Panel',

    draggable:true,
    height:501,
    html:' <input type="file" id="id_model_file_input" style="width: 0px; display: inline;">',
    id:'id_entiMgr',
    width:300,
    title:'本地载入',

    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            viewConfig:{

            },
            columns:[
                {
                    xtype:'treecolumn',
                    dataIndex:'text',
                    flex:1,
                    text:'Nodes'
                }
            ],
            dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    width:230,
                    items:[
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            handler:function (button, event) {
                                document.getElementById('id_model_file_input').click();
                            },
                            allowDepress:false,
                            enableToggle:false,
                            pressed:false,
                            text:'+'
                        },
                        {
                            xtype:'textareafield',
                            width:120,
                            inputId:'id_entiName',
                            fieldLabel:'组件名',
                            labelWidth:50
                        },
                        {
                            xtype:'textareafield',
                            width:120,
                            inputId:'id_preEntiName',
                            fieldLabel:'父对象',
                            labelWidth:50
                        },
                        {
                            xtype:'tbspacer'
                        },
                        {
                            xtype:'tbseparator'
                        }
                    ]
                }
            ],
            tools:[
                {
                    xtype:'tool',
                    tooltip:'close',
                    type:'close',
                    handler:function () {
                        global_extPanelManager.m_oEntiLocalIOPlugin.setMenuHide();
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});