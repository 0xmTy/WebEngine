function EntiCompAtom(){
    this.m_oEntiArr = null;
    this.m_vBBbox = null;
    this.m_strName = null;

    this.init = function(entiList,strName){
        this.m_oEntiArr = new HashMap();
        for(var i = 0; i < entiList.length; ++i){
            this.m_oEntiArr.put(entiList[i].getName(),entiList[i]);
        }
        var vMinMaxPoiArr = this.clacBBoxMinMaxPoi();
        this.m_vBBbox = new okAABBox(vMinMaxPoiArr[0],vMinMaxPoiArr[1]);
        this.m_strName = strName;
    }

    /*
    *计算复合结构的BBox
     */
    this.clacBBoxMinMaxPoi = function(){
        var resArr = new Array(new okVec3(),new okVec3());
        /*
            ...
         */
        return resArr;
    }

    this.setPos = function(vec3){

    }

    this.getPos = function(){
        var resArr = okVec3();
        return resArr;
    }

    this.getBoundingBox =function(){
        return this.m_vBBbox;
    }

    this.setName = function(strName){
        this.m_strName = strName;
    }

    this.getName = function(){
        return this.m_strName;
    }

    this.isBelongto = function(obj){

    }
}