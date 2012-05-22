var Y2FastOverlay = function (geometry, data, options) {
    //вообще-то считается что сюда входит пиксельная геометрия
    //но в данном случае - это не так
    this._GEOmetry = geometry;
    this._GEOmetry.events.add('pixelgeometrychange', this._readPosition, this);
    this._geometry = 0;
    this._data = data;

    //создадим опции на основе обычного хэша
    this.options = options;
};

Y2FastOverlay.prototype = {
    setMap: function (map) {
        if (this._map != map) {
            var oldMap = this._map;
            if (oldMap) {
                this.onRemoveFromMap(oldMap);
            }
            this._map = map;
            if (this._map) {
                this.onAddToMap();
            }
        }
    },

    getMap: function () {
        return this._map;
    },

    onAddToMap: function () {
        this._div = document.createElement('div');
        this._div.style.cssText = 'position:absolute;border:1px solid #000;border-radius:5px;width:12px;height:12px;background-color:#0F0';
        this._pane = this._map.panes.get('overlays');
        this._pane.getElement().appendChild(this._div);
        this._pane.events.add('actionend', this._reposite, this);

        //свяжем геометрию напрямую с картой
        this._GEOmetry.options.setParent(this._map.options)
        this._GEOmetry.setMap(this._map);
        this._readPosition();
    },

    onRemoveFromMap: function () {
        this._div.parentElement.removeChild(this._div);
        this._pane.events.remove('actionend', this._reposite, this)
        this._div = null;
    },

    setGeometry: function (geometry) {
        var oldGeometry = this._geometry;
        this._geometry = geometry;
        if (this._map) {
            this.applyGeometry();
        }
    },

    getGeometry: function () {
        return this._geometry;
    },

    _readPosition: function () {
        this._geometry = this._GEOmetry.getPixelGeometry();
        this._reposite();
    },

    _reposite: function () {
        var point = this._pane.toClientPixels(this._geometry.getCoordinates()),
            viewport = this._pane.getViewport();
        //но мы не обратим внимание на viewport

        //эмулируем objectManager
        if(Math.abs(point[0])>200 || Math.abs(point[1])>200){
            this._div.style.display='none';
        }
        else{
            this._div.style.cssText+=';display:block;left:'+Math.round(point[0]) + 'px;top:'+Math.round(point[1]) + 'px';
        }
    },

    setData: function (data) {
        var oldData = this._data;
        this._data = data;
    },

    getData: function () {
        return this._data;
    },

    isEmpty: function () {
        return false;
    }
};