function MainEngineObject() {

    this.m_enOakEngine = null;
    this.m_camCameraList = null; // 相机列表
    this.m_camActivityCam = null; //当前活动相机
    this.m_mgrSceneManager = null; //场景管理器
    this.m_scenSceneList = null;
    this.m_scenActivityScene = null; //当前活动场景
    this.m_usrOpera = null; //交互类
    this.mainLoopActivity = false;

    this.m_oInitWorldConf = {
        m_strBaseUrl:"模型资源",
        m_strModelUrl:"模型资源/Models",
        m_strTextureUrl:"模型资源/Textures",
        m_strSkAnimationUrl:"模型资源/Animations",

        m_vBBox:new Array(new okVec3(-1000, -1000, -1000), new okVec3(1000, 100, 1000)),
        m_oIniCamConf:{
            m_strCamName:"main_cam",
            m_vCamBackGroundColor:new okVec4(0.0, 0.0, 0.0, 1.0),
            m_enumProjMode:OAK.PROJMODE_PERSPECTIVE,
            m_vVisbleRange:new okVec2(1, 10000),
            m_vCamPos:new okVec3(0, 0, 200),
            m_vCamLookat:new okVec3(0, 0, 0),
            m_vCamLookUp:new okVec3(0, 1, 0),
            m_fCamFov:60.0
        }
    };

    this.setInitWorldConfData = function (e) {
        this.m_oInitWorldConf = e;
    }

    this.getInitWorldConfData = function () {
        return this.m_oInitWorldConf;
    }

    this.onRender = function () {
        var vMainEngineObj = global_oakEngineManager.getMainEngineObject();
        var tmpMainRenderer = vMainEngineObj.m_enOakEngine.getRenderer(); //渲染器

        tmpMainRenderer.beginView(vMainEngineObj.m_camActivityCam);
        global_renderUpdata();
        tmpMainRenderer.renderScene(vMainEngineObj.m_scenActivityScene);
        tmpMainRenderer.endView();

        //present the image to the canvas
        tmpMainRenderer.present();

        okRequestAnimationFrame(vMainEngineObj.onRender);
    }

    this.startMainEngineLoop = function () {
        okRequestAnimationFrame(this.onRender);
    }

    this.init = function (parameters) {

        //初始化帧循环函数调用容器
        if (null == global_renderFuncArr) {
            global_renderFuncArr = new Array();
        }

        this.m_usrOpera = new UsrOperaObj();
        this.m_usrOpera.init();

        this.m_enOakEngine = new okEngine();
        var bIsInitSuccesful = this.m_enOakEngine.init(parameters);
        if (true == bIsInitSuccesful) {
            this.m_mgrSceneManager = this.m_enOakEngine.getSceneManager();
            return true;
        } else {
            return false;
        }
    }

    this.createStaticCam = function (camName, oldCam, curScene) {
        var newCam = curScene.createCamera(camName);
        var tmpVec4 = oldCam.getBackColor();
        newCam.setBackColor(tmpVec4.x, tmpVec4.y, tmpVec4.z, tmpVec4.w);
        newCam.setViewport(oldCam.getViewportLeft(), oldCam.getViewportTop(),
            oldCam.getViewportWidth(), oldCam.getViewportHeight());
        // view mat
        newCam.setMat(oldCam.getMat4());
        var tmpVec3 = oldCam.getPos();
        newCam.setPos(tmpVec3.x, tmpVec3.y, tmpVec3.z);
        //proj
        newCam.setProjMode(oldCam.getProjMode());
        newCam.setFov(oldCam.getFov());
        newCam.setVisibleRange(oldCam.getVisibleNear(), oldCam.getVisibleFar());

        //global_oakEngineManager.getMainEngineObject().m_camActivityCam = newCam;
        return newCam;
    }
    this.activCam = function (cam) {

        var tmpVec4 = cam.getBackColor();
        this.m_camActivityCam.setBackColor(tmpVec4.x, tmpVec4.y, tmpVec4.z, tmpVec4.w);
        this.m_camActivityCam.setViewport(cam.getViewportLeft(), cam.getViewportTop(),
            cam.getViewportWidth(), cam.getViewportHeight());
        // view mat
        this.m_camActivityCam.setMat(cam.getMat4());
        var tmpVec3 = cam.getPos();
        this.m_camActivityCam.setPos(tmpVec3.x, tmpVec3.y, tmpVec3.z);
        //proj
        this.m_camActivityCam.setProjMode(cam.getProjMode());
        this.m_camActivityCam.setFov(cam.getFov());
        this.m_camActivityCam.setVisibleRange(cam.getVisibleNear(), cam.getVisibleFar());
    }
    this.activeScene = function (scene) {
        //alert(scene.getName());
        this.m_scenActivityScene = scene;
        var camList = new Array();
        scene.getCameraArray(camList, function () {
            return true;
        });
        if (0 < camList.length) {
            this.m_camActivityCam = (camList[0]);
        } else {
            var oak_mainEngineObj = this.getMainEngineObject();
            var camConf = this.m_oInitWorldConf.m_oIniCamConf;
            oak_mainEngineObj.m_camActivityCam = this.m_scenActivityScene.createCamera(camConf.m_strCamName);
            oak_mainEngineObj.m_camActivityCam.setViewport(0, 0, canvas.width, canvas.height);
            oak_mainEngineObj.m_camActivityCam.setBackColor(camConf.m_vCamBackGroundColor.x,
                camConf.m_vCamBackGroundColor.y,
                camConf.m_vCamBackGroundColor.z,
                camConf.m_vCamBackGroundColor.w);

            oak_mainEngineObj.m_camActivityCam.setProjMode(camConf.m_enumProjMode);

            if (OAK.PROJMODE_PERSPECTIVE == camConf.m_enumProjMode) {
                //透视投影
                oak_mainEngineObj.m_camActivityCam.setFov(camConf.m_fCamFov);
                oak_mainEngineObj.m_camActivityCam.setVisibleRange(camConf.m_vVisbleRange.x, camConf.m_vVisbleRange.y);
                oak_mainEngineObj.m_camActivityCam.setPos(camConf.m_vCamPos.x, camConf.m_vCamPos.y, camConf.m_vCamPos.z);
                oak_mainEngineObj.m_camActivityCam.lookAt(camConf.m_vCamLookat.x, camConf.m_vCamLookat.y, camConf.m_vCamLookat.z,
                    camConf.m_vCamLookUp.x, camConf.m_vCamLookUp.y, camConf.m_vCamLookUp.z);
            } else {
                //正交投影
            }
        }
    }
}

function UsrOperaObj() {
    this.m_bTipMainCanvas = false;
    this.m_vCurMousePos = null;
    this.m_vLastTipMainCanvas = null;
    this.m_vLastMoveMainCanvas = null;

    this.m_oCurOperaMod = null;
    this.m_oMoveCamObj = null;
    this.m_oEntiOperaObj = null;

    this.m_oKeybordHash = null;
    this.m_bHavePresKey = null; //一个键盘按压的引用计数

    this.init = function () {
        this.m_bHavePresKey = 0;
        this.m_oKeybordHash = new Array(300);
        for (var i = 0; i < 300; ++i) this.m_oKeybordHash[i] = false;

        this.m_oMoveCamObj = new MoveCamObj();
        this.m_oMoveCamObj.init();

        this.m_oEntiOperaObj = new EntiOperaObj();
        this.m_oEntiOperaObj.init();

        this.m_oCurOperaMod = this.m_oMoveCamObj;
    }
}

function MoveCamObj() {
    this.m_iCamMovSpeed = 1;
    this.m_bChangeCamOld = false;
    this.m_bChangeCamNew = false;

    this.init = function () {

    }

    this.mouseDown = function () {
        if (false == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
            return;
        }
        if (false == this.__tipEnti()) {

        } else {
            // 已废弃 by _mTy 2012.12.26
        }
    }
    this.mouseUp = function () {
        if (false == global_oakEngineManager.getMainEngineObject().mainLoopActivity) {
            return;
        }
    }
    this.mouseMove = function () {
        if (false == global_oakEngineManager.getMainEngineObject().mainLoopActivity ||
            false == global_oakEngineManager.getMainEngineObject().m_usrOpera.m_bTipMainCanvas) {
            return;
        }
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var usrOpr = mainEngineObj.m_usrOpera;
        var curCam = mainEngineObj.m_camActivityCam;
        if (false != usrOpr.m_bHavePresKey) {
            if (true == usrOpr.m_oKeybordHash[88]) {
                //var currPickPoi = curCam.getPickPoint(usrOpr.m_vCurMousePos.x, usrOpr.m_vCurMousePos.y);
                //var oldPickPoi = curCam.getPickPoint(usrOpr.m_vLastMoveMainCanvas.x, usrOpr.m_vLastMoveMainCanvas.y);
                var tmpCnt = (usrOpr.m_vCurMousePos.y - usrOpr.m_vLastMoveMainCanvas.y) * -1;
                tmpCnt = tmpCnt / (global_mainCanvasHeight);
                var resRote = (tmpCnt) * (180);
                this.__roteActivityCamX(OAK.SPACE_LOCAL, curCam, resRote);
            }
            if (true == usrOpr.m_oKeybordHash[89]) {
                var tmpCnt = (usrOpr.m_vCurMousePos.x - usrOpr.m_vLastMoveMainCanvas.x) * -1;
                tmpCnt = tmpCnt / (global_mainCanvasWidth);
                var resRote = (tmpCnt) * (180);
                this.__roteActivityCamY(OAK.SPACE_LOCAL, curCam, resRote);
            }
            if (true == usrOpr.m_oKeybordHash[90]) {
                var tmpCnt = (usrOpr.m_vCurMousePos.x - usrOpr.m_vLastMoveMainCanvas.x) +
                    (usrOpr.m_vCurMousePos.y - usrOpr.m_vLastMoveMainCanvas.y);
                tmpCnt = tmpCnt / (global_mainCanvasWidth + global_mainCanvasHeight);
                var resRote = (tmpCnt) * (180);
                this.__roteActivityCamZ(OAK.SPACE_LOCAL, curCam, resRote);
            }
        } else {
            var currPickPoi = curCam.getPickPoint(usrOpr.m_vCurMousePos.x, usrOpr.m_vCurMousePos.y);
            var oldPickPoi = curCam.getPickPoint(usrOpr.m_vLastMoveMainCanvas.x, usrOpr.m_vLastMoveMainCanvas.y);
            var moveDir = okVec3MulVal(new okVec3(oldPickPoi.x - currPickPoi.x, oldPickPoi.y - currPickPoi.y, oldPickPoi.z - currPickPoi.z), curCam.getPos().len());
            this.__moveCam(curCam, moveDir);

            if (true == this.m_bChangeCamNew) {
                this.m_bChangeCamNew = false;
            } else {
                this.m_bChangeCamNew = true;
            }
        }
    }

    this.keyBoardPressFunc = function (e) {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var usrObj = mainEngineObj.m_usrOpera;
        var curCam = mainEngineObj.m_camActivityCam;

        global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.m_iCamMovSpeed =
            global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.m_iCamMovSpeed + 0.1;

        var tCnt = global_oakEngineManager.getMainEngineObject().m_usrOpera.m_oCurOperaMod.m_iCamMovSpeed;

        //var rotTarget = okVec3Add(curCam.getPos(), okVec3MulVal(curCam.getForwardDir().normalize(),this.__curFarwayFunc()));
        var rotTarget = okVec3Add(curCam.getPos(), okVec3MulVal(curCam.getForwardDir(), 1));
        var moveLen = curCam.getForwardDir().len();

        switch (e.keyCode) {
            case 38:
            {
                if (true == mainEngineObj.mainLoopActivity) {
                    if (true == usrObj.m_bTipMainCanvas) {
                        var resRote = 1 * tCnt;
                        //this.__roteActivityCamX(curCam, resRote);
                        //alert(rotTarget.x + ' ' + rotTarget.y + ' ' + rotTarget.z);
                        //curCam.rotTarget(resRote,rotTarget,curCam.getRightDir().normalize());
                    } else {
                        var resLen = moveLen;
                        resLen *= tCnt;
                        this.__moveActivityCamDepth(curCam, resLen);
                    }
                }
                break;
            }
            case 40:
            {
                if (true == mainEngineObj.mainLoopActivity) {
                    if (true == usrObj.m_bTipMainCanvas) {
                        var resRote = 1 * tCnt;
                        //this.__roteActivityCamX(curCam, -1 * resRote);
                        //curCam.rotTarget(-1 * resRote,rotTarget,curCam.getRightDir().normalize());
                    } else {
                        var resLen = moveLen;
                        resLen *= tCnt;
                        this.__moveActivityCamDepth(curCam, -1 * resLen);
                    }
                }
                break;
            }
            case 37:
            {
                if (true == mainEngineObj.mainLoopActivity) {
                    if (true == usrObj.m_bTipMainCanvas) {
                        var resRote = 1 * tCnt;
                        //this.__roteActivityCamY(curCam, resRote);
                        //curCam.rotTarget(-1 * resRote,rotTarget,curCam.getUpDir().normalize());
                    } else {
                        var resLen = moveLen;
                        resLen = resLen * tCnt;
                        this.__moveActivityCamRight(curCam, -1 * resLen);
                    }
                }
                break;
            }
            case 39:
            {
                if (true == mainEngineObj.mainLoopActivity) {
                    if (true == usrObj.m_bTipMainCanvas) {
                        var resRote = 1 * tCnt;
                        //this.__roteActivityCamY(curCam, -1 * resRote);
                        //curCam.rotTarget(resRote,rotTarget,curCam.getUpDir().normalize());
                    } else {
                        var resLen = moveLen;
                        resLen = resLen * tCnt;
                        this.__moveActivityCamRight(curCam, resLen);
                    }
                }
                break;
            }
            default :
            {
                break;
            }
        }
        if (true == this.m_bChangeCamNew) {
            this.m_bChangeCamNew = false;
        } else {
            this.m_bChangeCamNew = true;
        }
    }
    this.keyBoardUpFunc = function (event) {
        this.m_iCamMovSpeed = 1.0;
        if (false != global_oakEngineManager.getMainEngineObject().mainLoopActivity) {

        }
    }
    this.keyBoardDownFunc = function (event) {
        if (false != global_oakEngineManager.getMainEngineObject().mainLoopActivity) {

        }
    }
    this.__roteActivityCamX = function (conf, cam, xita) {
        cam.rotX(conf, xita);
    }
    this.__roteActivityCamY = function (conf, cam, xita) {
        cam.rotY(conf, xita);
    }
    this.__roteActivityCamZ = function (conf, cam, xita) {
        cam.rotZ(conf, xita);
    }
    this.__moveActivityCamDepth = function (cam, dir) {
        cam.moveForward(dir);
    }
    this.__moveActivityCamRight = function (cam, dir) {
        cam.moveRight(dir);
    }
    this.__tipEnti = function () {
        return false;
    }
    this.__moveCam = function (cam, dir) {
        cam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
        //cam.moveUp(dir.y);
        //cam.moveRight(dir.x);
        //cam.moveForward(dir.z);
        cam.move(OAK.SPACE_WORLD, dir.x, dir.y, dir.z);
        global_oakEngineManager.getMainEngineObject().m_camActivityCam = cam;
    }
    this.clearAll = function () {

    }
}

function EntiOperaObj() {
    var m_vSletEntiMap = null; //拓展为容器,支持复选操作 by _mTy 2013.3.21
    var m_iOprCodec = null;

    this.init = function () {
        this.m_vSletEntiMap = new HashMap();
    }

    this.getSletedEnti = function(strName){
        return this.m_vSletEntiMap.get(strName);
    }

    this.getSletedEntis = function(){
        return this.m_vSletEntiMap.values();
    }

    this.getSletedEntiNames = function(){
        return this.m_vSletEntiMap.keySet();
    }
    this.__initBoundingBox = function () {
        /* done by _mTy 2013.3.25
        //create a custom mesh entity for drawing bounding box
        var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        this.m_oBoundingbox = scene.createEntity(OAK.ETYPE_CUSTOM_MESH, "BoundingBox");
        this.m_oBoundingbox.setName("BoundingBox");
        this.m_oBoundingbox.createAttribute("Position", 8 * 3, null, OAK.DYNAMIC_DRAW);
        this.m_oBoundingbox.createIndex("Wireframe", 12 * 2, null, OAK.DYNAMIC_DRAW, OAK.LINES);
        this.m_oBoundingbox.getMaterial().setEmissive(1.0, 1.0, 0.0);
        this.m_oBoundingbox.getMaterial().setDiffuse(0, 0, 0);
        this.m_oBoundingbox.getMaterial().enableDynamicLighting(false);

        this.m_oBoundingbox.enableVisible(false);
        */
        /* done
        if (null == global_renderFuncArr) {
            alert('函数指针数组: global_renderFuncArr is null !');
            return;
        }
        global_renderFuncArr.push(new Array(this, this.updataBBox));
        */
    }

    this.drawBoundingBox = function () {
        /* done by _mTy 2013.3.25
        if (null == this.m_oBoundingbox) {
            this.__initBoundingBox();
        }
        if (null == this.m_oCurSletEnti) {
            return;
        }
        var curBBox = this.m_oCurSletEnti.getBoundingBox();
        var vMin = curBBox.getMin();
        var vMax = curBBox.getMax();

        var aPosArray = [vMin.x, vMin.y, vMin.z,
            vMax.x, vMin.y, vMin.z,
            vMax.x, vMax.y, vMin.z,
            vMin.x, vMax.y, vMin.z,
            vMin.x, vMin.y, vMax.z,
            vMax.x, vMin.y, vMax.z,
            vMax.x, vMax.y, vMax.z,
            vMin.x, vMax.y, vMax.z];

        var aIndexArray = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];

        this.m_oBoundingbox.loadAttribute("Position", 0, aPosArray.length, aPosArray);
        this.m_oBoundingbox.loadIndex("Wireframe", 0, aIndexArray.length, aIndexArray);
        this.m_oBoundingbox.setActiveIndex("Wireframe", OAK.LINES, 0, aIndexArray.length);
        //this.m_oBoundingbox.enableVisible(false);
        */
    }

    this.setBoundingBoxVisible = function (e) {
        /* done 2013.3.25
        if (null == this.m_oBoundingbox) {
            return;
        }
        this.m_oBoundingbox.enableVisible(e);
        */
    }

    this.clearAll = function () {
        this.m_iOprCodec = null;
        this.m_vSletEntiMap.clear();
        global_oakEngineManager.m_oUnCoreDrawMgrPlugin.m_oReferInfoDraw.m_oBoundingBoxDraw.clearAll();
        global_extPanelManager.getMainWindowObj().sletEntiOperaMenuHide();

    }
    this.mouseDown = function () {
        //return ;
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var usrObj = mainEngineObj.m_usrOpera;

        var cam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
        var vCamPos = cam.getPos();
        var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
        var vPickDir = cam.getPickDir(usrOpr.m_vCurMousePos.x, usrOpr.m_vCurMousePos.y);
        var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        var tmpSletEnti = scene.pick(vCamPos, vPickDir, OAK.ETYPE_DYNAMIC, function (e) {
            return e.getName() != "BaseStandGroundMesh";
        });
        if (null != tmpSletEnti) {
            var oDrawBoxObj = global_oakEngineManager.m_oUnCoreDrawMgrPlugin.m_oReferInfoDraw.m_oBoundingBoxDraw;
            var strTmpEntiName = tmpSletEnti.getName();
            var oResFind = this.m_vSletEntiMap.get(strTmpEntiName);
            if (true/* 按压ctrl 需调整IO框架*/) {
                if (undefined == oResFind || null == oResFind) {
                    if(0 == this.m_vSletEntiMap.size()){
                        //显示菜单
                        global_extPanelManager.getMainWindowObj().sletEntiOperaMenuShow(usrOpr.m_vCurMousePos.x, usrOpr.m_vCurMousePos.y);
                    }
                    //添加新实体
                    this.m_vSletEntiMap.put(tmpSletEnti.getName(),tmpSletEnti);
                    oDrawBoxObj.addEntiBox(tmpSletEnti.getName());
                } else {
                    //取消物体
                    this.m_vSletEntiMap.remove(tmpSletEnti.getName());
                    oDrawBoxObj.delEntiBox(tmpSletEnti.getName());
                    if(0 == this.m_vSletEntiMap.size()){
                        global_extPanelManager.getMainWindowObj().sletEntiOperaMenuHide();
                    }
                }
            } else {
                if (undefined == oResFind || null == oResFind) {
                    //清空复选实体容器
                    this.m_vSletEntiMap.clear();
                    //装入当前对象
                    this.m_vSletEntiMap.put(tmpSletEnti.getName(),tmpSletEnti);
                } else {
                    //nothing to do
                }
            }

            /*
             if (null == this.m_oCurSletEnti || (tmpSletEnti.getName() != this.m_oCurSletEnti.getName())) {
             if(null != this.m_oCurSletEnti){
             //清除原物体高亮
             for (var sMeshName in this.m_oCurSletEnti.getMaterialMap()) {
             var mtrl = this.m_oCurSletEnti.getMaterial(sMeshName);
             mtrl.setEmissive(0, 0, 0.0);
             }
             }
             this.m_oCurSletEnti = tmpSletEnti;
             global_extPanelManager.getMainWindowObj().sletEntiOperaMenuShow(usrOpr.m_vCurMousePos.x, usrOpr.m_vCurMousePos.y);
             this.m_iOprCodec = null; //清空小菜单操作码
             this.drawBoundingBox();
             this.setBoundingBoxVisible(true);

             //设置拾取物体高亮
             for (var sMeshName in this.m_oCurSletEnti.getMaterialMap()) {
             var mtrl = this.m_oCurSletEnti.getMaterial(sMeshName);
             mtrl.setEmissive(0.5, 0.5, 0.0);
             }
             } else {
             //点选的是同一物
             }
             */
        }

        switch (usrObj.m_oEntiOperaObj.m_iOprCodec) {
            case null:
            {

            }
            default :
            {

            }
        }
    }
    this.mouseUp = function () {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var usrObj = mainEngineObj.m_usrOpera;
        switch (usrObj.m_oEntiOperaObj.m_iOprCodec) {
            default :
            {

            }
        }
    }
    this.mouseMove = function () {
        var mainEngineObj = global_oakEngineManager.getMainEngineObject();
        var usrObj = mainEngineObj.m_usrOpera;
        switch (usrObj.m_oEntiOperaObj.m_iOprCodec) {
            case 0x00000000:
            {
                // move
                if (true == usrObj.m_bTipMainCanvas) {
                    var havPress = false;
                    if (true == usrObj.m_oKeybordHash[88]) {
                        // x...
                        havPress = true;
                        var cam = mainEngineObj.m_camActivityCam;
                        var tmpVec2 = okVec2Sub(usrObj.m_vCurMousePos, usrObj.m_vLastMoveMainCanvas);
                        var cnt1 = Math.abs(tmpVec2.x) / (global_mainCanvasWidth);
                        var hfFov = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_fCamFov / 2;

                        var hfNearPlanWidth = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x *
                            Math.tan((hfFov * Math.PI) / 180);
                        /* 平截头体上划过的真实距离,按照鼠标划过的线段在Canvas上的长度与在平截头体近截面上的长度等比例 */
                        var cnt2 = cnt1 * (hfNearPlanWidth) * 2;

                        var movDir = new okVec3(((tmpVec2.x > 0) ? (cnt2) : (-1 * cnt2)), 0, 0);
                        var enti2eyeLen = okVec3Sub(cam.getPos(), usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos()).len();
                        /* 始终假设x轴平行于近裁剪平面，得三角形等比例关系进行计算 */
                        movDir = okVec3MulVal(movDir, (enti2eyeLen / 1));

                        var oldPos = usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos();
                        usrObj.m_oEntiOperaObj.m_oCurSletEnti.setPos(okVec3Add(oldPos, movDir));
                    }
                    if (true == usrObj.m_oKeybordHash[89]) {
                        // y..
                        havPress = true;
                        var cam = mainEngineObj.m_camActivityCam;
                        var tmpVec2 = okVec2Sub(usrObj.m_vCurMousePos, usrObj.m_vLastMoveMainCanvas);
                        var cnt1 = Math.abs(tmpVec2.y) / (global_mainCanvasHeight);
                        var hfFov = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_fCamFov / 2;

                        var hfNearPlanHeight = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x *
                            Math.tan((hfFov * Math.PI) / 180);
                        /* 平截头体上划过的真实距离,按照鼠标划过的线段在Canvas上的长度与在平截头体近截面上的长度等比例 */
                        var cnt2 = cnt1 * (hfNearPlanHeight) * 2;

                        var movDir = new okVec3(0, ((tmpVec2.y < 0) ? (cnt2) : (-1 * cnt2)), 0);
                        var enti2eyeLen = okVec3Sub(cam.getPos(), usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos()).len();
                        /* 始终假设y轴平行于近裁剪平面，得三角形等比例关系进行计算 */
                        movDir = okVec3MulVal(movDir, (enti2eyeLen / 1));

                        var oldPos = usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos();
                        usrObj.m_oEntiOperaObj.m_oCurSletEnti.setPos(okVec3Add(oldPos, movDir));
                    }
                    if (true == usrObj.m_oKeybordHash[90]) {
                        // z...
                        havPress = true;
                        var cam = mainEngineObj.m_camActivityCam;
                        var tmpVec2 = okVec2Sub(usrObj.m_vCurMousePos, usrObj.m_vLastMoveMainCanvas);
                        var cnt1 = (Math.abs(tmpVec2.x) + Math.abs(tmpVec2.y)) / (global_mainCanvasWidth + global_mainCanvasHeight);
                        var hfFov = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_fCamFov / 2;

                        var hfNearPlanHeight = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x *
                            Math.tan((hfFov * Math.PI) / 180);
                        var hfNearPlanWidth = mainEngineObj.m_oInitWorldConf.m_oIniCamConf.m_vVisbleRange.x *
                            Math.tan((hfFov * Math.PI) / 180);

                        /* 平截头体上划过的真实距离,按照鼠标划过的线段在Canvas上的长度与在平截头体近截面上的长度等比例 */
                        var cnt2 = cnt1 * (hfNearPlanWidth + hfNearPlanHeight) * 2;

                        var movDir = new okVec3(0, 0, ((tmpVec2.x + tmpVec2.y < 0) ? (cnt2) : (-1 * cnt2)));
                        var enti2eyeLen = okVec3Sub(cam.getPos(), usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos()).len();
                        /* 始终假设z轴平行于近裁剪平面，得三角形等比例关系进行计算 */
                        movDir = okVec3MulVal(movDir, (enti2eyeLen / 1));

                        var oldPos = usrObj.m_oEntiOperaObj.m_oCurSletEnti.getPos();
                        usrObj.m_oEntiOperaObj.m_oCurSletEnti.setPos(okVec3Add(oldPos, movDir));
                    }
                    if (false == havPress) {
                        /* 跟随鼠标位置移动  废弃 by _mTy  2013.1.19 */
                        /*
                         var cam = mainEngineObj.m_camActivityCam;

                         var poiPickOnWorld_old = cam.getPickPoint(usrObj.m_vLastMoveMainCanvas.x, usrObj.m_vLastMoveMainCanvas.y);
                         var poiPickOnWorld_new = cam.getPickPoint(usrObj.m_vCurMousePos.x, usrObj.m_vCurMousePos.y);

                         var eyePos = cam.getPos();
                         var enti2eye_old = okVec3Sub(this.m_oCurSletEnti.getPos(), eyePos);
                         var enti2eye_new = okVec3MulVal(okVec3Sub(poiPickOnWorld_new, eyePos).normalize(false), (enti2eye_old.len()));
                         this.m_oCurSletEnti.setPos(okVec3Add(eyePos, enti2eye_new));
                         */
                    }
                    if (null != this.m_oBoundingbox) {
                        this.setBoundingBoxVisible(false);
                        this.drawBoundingBox();
                        this.setBoundingBoxVisible(true);
                    }
                }
                break;
            }
            case 0x00000001:
            {
                if (true == usrObj.m_bTipMainCanvas) {
                    var tmpVec = okVec3Sub(usrObj.m_vCurMousePos, usrObj.m_vLastMoveMainCanvas);
                    var cnt = 1.0 + ((tmpVec.x + tmpVec.y > 0.0) ? (0.1) : (-0.1));
                    this.m_oCurSletEnti.scale(OAK.SPACE_LOCAL, cnt, cnt, cnt);
                }
                break;
            }
            default :
            {
                break;
            }
        }
    }
    this.__tipEnti = function (x, y) {
        var cam = global_oakEngineManager.getMainEngineObject().m_camActivityCam;
        var usrOpr = global_oakEngineManager.getMainEngineObject().m_usrOpera;
        var vCamPos = cam.getPos();
        var vPickDir = cam.getPickDir(x, y);
        var scene = global_oakEngineManager.getMainEngineObject().m_scenActivityScene;
        var tmpSletEnti = scene.pick(vCamPos, vPickDir);
        return tmpSletEnti;
    }
    this.keyBoardPressFunc = function (e) {
        switch (e.keyCode) {
            case 38:
            {
                break;
            }
            case 40:
            {
                break;
            }
            default :
            {
                break;
            }
        }
    }
    this.keyBoardUpFunc = function (event) {

    }
    this.keyBoardDownFunc = function (event) {

    }
}

