function ExtPanelManager() {

    this.v_extMainPanelObj = null;
    this.m_oAboutPanelObj = null;

    // 插件化
    this.m_oEntiLocalIOPlugin = null;
    this.m_oRenderConfPlugin = null;

    this.initPlugin = function () {
        this.m_oAboutPanelObj = new ExtAboutPanelObj();
        this.m_oAboutPanelObj.init();

        this.m_oEntiLocalIOPlugin = new ExtEntiLocalIOObj();
        this.m_oEntiLocalIOPlugin.init();

        this.m_oRenderConfPlugin = new ExtRenderConfObj();
        this.m_oRenderConfPlugin.init();
    }

    this.setMainWindowObj = function (obj) {
        this.v_extMainPanelObj = obj;
    }
    this.getMainWindowObj = function () {
        return this.v_extMainPanelObj;
    }
}

var global_extPanelManager = null;
