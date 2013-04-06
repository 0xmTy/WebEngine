function ExtEntiLocalIOObj() {
    this.m_uiPanel = null;
    this.init = function () {
        this.m_uiPanel = Ext.create('Mty.view.EntiMgrPanel', {
            renderTo:'id_controlMainWindow-body',
            x:global_mainCanvasWidth - 250,
            y:0
        });
        this.setMenuHide();
        document.getElementById('id_model_file_input').addEventListener("change", this.handleModelListener, false);
    }
    this.handleModelListener = function () {
        var strCurEntiName = Ext.get('id_entiName').getValue().toString();
        /*
        为导入实体绑定父亲实体的功能已废弃  by _mTy 2013.4.6
        */
        //var strPreEntiName = Ext.get('id_preEntiName').getValue().toString();
        var strPreEntiName = "";
        if("" == strCurEntiName || undefined == strCurEntiName || null == strCurEntiName){
            alert("未命名的实体！");
            return ;
        }
        global_oakEngineManager.m_oEntiMgrPlugin.m_oLocalModelIO.m_strEntiPreName
            = strPreEntiName;
        global_oakEngineManager.m_oEntiMgrPlugin.m_oLocalModelIO.m_strEntiName
            = strCurEntiName;
        //alert(Ext.get('id_entiName').getValue().toString());
        global_extPanelManager.m_oEntiLocalIOPlugin.handleModelFile(this.files[0]);
    }
    this.handleModelFile = function (file) {
        var name = file.name;
        var extend = name.substring(name.lastIndexOf('.')).toLowerCase();
        global_oakEngineManager.m_oEntiMgrPlugin.m_oLocalModelIO.parseModel(file);
    }
    this.setMenuShow = function () {
        this.m_uiPanel.setVisible(true);
    }
    this.setMenuHide = function () {
        this.m_uiPanel.setVisible(false);
    }
}

function ExtAboutPanelObj() {
    this.m_uiAboutPanel = null;
    this.init = function () {
    }
}

function ExtRenderConfObj() {
    this.m_uiPanel = null;
    this.m_icamItemMap = null;
    this.m_isceneItemMap = null;
    this.init = function () {
        this.m_icamItemMap = new HashMap();
        this.m_isceneItemMap = new HashMap();
        this.m_uiPanel = Ext.create('Mty.view.Render_Cam_Conf', {
            renderTo:'id_controlMainWindow-body',
            x:global_mainCanvasWidth - 300,
            y:0,
            //height:(650 < global_mainCanvasHeight) ? (650) : (global_mainCanvasHeight - 24),
            //height:global_mainCanvasHeight,
            id:'id_renderConf'
        });
        /*
         this.m_uiPanel = Ext.create('Mty.view.EnvirEditor', {
         renderTo:'id_controlMainWindow-body',
         width:647,
         height:51,
         x:10,
         y:10,
         id:'id_envirEditor'
         });
         */
        this.setMenuHide();
    }
    this.setMenuShow = function () {
        if (null != this.m_uiPanel && undefined != this.m_uiPanel) {
            this.m_uiPanel.show();
        }
    }
    this.setMenuHide = function () {
        if (null != this.m_uiPanel && undefined != this.m_uiPanel) {
            this.m_uiPanel.hide();
        }
    }
    this.addCam = function (cam) {
        var camInfo = Ext.get('id_renderConf_camName').getValue();
        if ("" == camInfo || undefined == camInfo) {
            camInfo = 'cam_' + this.m_icamItemMap.size().toString();
        }
        cam.setName(camInfo);
        var curScene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        //避免对象的引用传递发生错误,为当前场景创建新相机
        var newCam = global_oakEngineManager.getMainEngineObject().createStaticCam(camInfo, cam, curScene);
        //global_cam = newCam;
        this.m_icamItemMap.put(camInfo, newCam);
        this.addCurCam2UiItem(camInfo);
    }
    this.addCurCam2UiItem = function (info) {
        var btnContainer = Ext.getCmp('id_camItemSet');
        var mapSize = this.m_icamItemMap.size();
        var newBtn = {
            xtype:'button',
            width:250,
            id:'id_camLabel_' + (mapSize - 1).toString(),
            text:info,
            handler:function () {
                var resCam = global_extPanelManager.m_oRenderConfPlugin.m_icamItemMap.get(info);
                //将当前相机列表项激活为活动相机
                global_oakEngineManager.getMainEngineObject().activCam(resCam);
            }
        };
        btnContainer.add([newBtn]);
    }
    this.clearCamList = function () {
        var btnContainer = Ext.getCmp('id_camItemSet');
        btnContainer.clear();
    }
//    http://tinyliu.info/2011/01/get/
    this.addCurScene2UiItem = function () {
        var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        this.m_isceneItemMap.put(scene.getName(), scene);
        var btContainer = Ext.getCmp('id_sceneList');
        var mapSize = this.m_isceneItemMap.size();
        var newBtn = {
            xtype:'button',
            width:250,
            id:'id_sceneLabel_' + (mapSize - 1).toString(),
            text:scene.getName(),
            handler:function () {
                var resScene = global_extPanelManager.m_oRenderConfPlugin.m_isceneItemMap.get(scene.getName());
                global_oakEngineManager.getMainEngineObject().activeScene(resScene);

                //this.clearCamList();
                /*
                 var scene = global_oakEngineManager.m_scenActivityScene;
                 var camList = new Array();
                 scene.getCameraArray(camList,function(){return true;});
                 for(var i = 0; i < camList.length; ++i){
                 var camName = camList[i].getName();
                 var curScene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
                 //避免对象的引用传递发生错误,为当前场景创建新相机
                 var newCam = global_oakEngineManager.getMainEngineObject().createStaticCam(camName, camList[i], curScene);
                 this.m_icamItemMap.put(camInfo, newCam);
                 this.addCurCam2UiItem(camInfo);
                 }
                 */
            }
        };
        btContainer.add([newBtn]);
    }
    this.setFogConf_ext = function () {
        var densityObj = Ext.getCmp('id_fog_density');
        var nearDistObj = Ext.getCmp('id_fog_near');
        var farDistObj = Ext.getCmp('id_fog_far');
        var checkObj = Ext.getCmp('id_fog_checkBox');
        var colorObjR = Ext.getCmp('id_fogColor_r');
        var colorObjG = Ext.getCmp('id_fogColor_g');
        var colorObjB = Ext.getCmp('id_fogColor_b');
        var pluginObj = global_oakEngineManager.m_oRenderConfPlugin;
        if (true == checkObj.getValue()) {
            pluginObj._setFogEnable_(OAK.ENV_FOG1, true);
            pluginObj._setFogDensity_(OAK.ENV_FOG1, Number(densityObj.getValue()));
            pluginObj._setFogDistanceNear_(OAK.ENV_FOG1, Number(nearDistObj.getValue()));
            pluginObj._setFogDistanceFar_(OAK.ENV_FOG1, Number(farDistObj.getValue()));
            pluginObj._setFogColor_(OAK.ENV_FOG1, Number(colorObjR.getValue()),
                Number(colorObjG.getValue()), Number(colorObjB.getValue()));
        } else {
            pluginObj._setFogEnable_(OAK.ENV_FOG1, false);
        }
    }
    this.setFov_ext = function (val) {
        if (true == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
            global_oakEngineManager.m_oRenderConfPlugin._setFov_(val);
        }
    }
    this.setBackColor_ext = function () {
        var tmpObjr = Ext.getCmp('id_slider_camColor_r');
        var tmpObjg = Ext.getCmp('id_slider_camColor_g');
        var tmpObjb = Ext.getCmp('id_slider_camColor_b');
        var tmpObja = Ext.getCmp('id_slider_camColor_a');
        var clorVec4 = new okVec4((Number(tmpObjr.getValue().toString()) * 1.0) / 255,
            (Number(tmpObjg.getValue().toString()) * 1.0) / 255,
            (Number(tmpObjb.getValue().toString()) * 1.0) / 255,
            (Number(tmpObja.getValue().toString()) * 1.0) / 255);
        global_oakEngineManager.m_oRenderConfPlugin._setBackColor_(clorVec4);
    }
}