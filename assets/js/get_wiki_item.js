console.log("Fetch: ", wikidatum);

function get_wikidatum(id){
    console.log('Getting from wikidata entity: ', id);
    // WikiMedia API based:
    let url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&format=json&languages=en|el&origin=*`;
    // WikiData URI based:
    // let url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;
    console.log('API endpoint:', url);
    var jqxhr = $.getJSON( url, function(data) {
          //console.log( "Success; entities returned: ", Object.keys(data).length );

          let description = get_json_value(['entities',id,'descriptions','el','value'], data);
          if (description)
            $('#wikidata_descr').text( get_first_upper(description) );

          let elwikititle = get_json_value(['entities',id,'sitelinks','elwiki','title'], data);
          if (elwikititle) {
            $('#wikidata_title').text( get_first_upper(elwikititle) );
            $('#wikidata_href').attr('href', 'https://el.wikipedia.org/wiki/'+elwikititle );
            $('#wikipedia_title').text('https://el.wikipedia.org/wiki/'+elwikititle );
          }


          let latlong = get_json_value(['entities',id,'claims','P625', 0,'mainsnak', 'datavalue', 'value'], data);
          if (latlong) {
              //$('#wikidata_location').text(JSON.stringify(value) );
              console.log('Create map');
              var map = L.map('map', {fullscreenControl: { pseudoFullscreen: true } }).setView([latlong.latitude, latlong.longitude], 13);
              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '© OpenStreetMap'}).addTo(map);
              var marker = L.marker([latlong.latitude, latlong.longitude]).addTo(map);
              marker.bindPopup(elwikititle).openPopup();
          }

          let image = get_json_value(['entities',id,'claims','P18', 0,'mainsnak', 'datavalue', 'value'], data);
          get_thumbnail(image, 1000);

        })
        .fail(function( jqxhr, textStatus, error ) {
            console.log( "Error getting wikidata. ", textStatus, error );
        });
}

function get_thumbnail(photoname, size){
    photoname = photoname.replaceAll(' ', '_');
    console.log('Getting '+size+'px thumb of: ', photoname);
    // WikiMedia API based:
    let url = `https://api.wikimedia.org/core/v1/commons/file/File:${photoname}`;
    var jqxhr = $.getJSON( url, function(data) {
        let credit = get_json_value(['latest','user','name'], data);
        // console.log('Photo credit: ', credit);

        let thumbname = get_json_value(['thumbnail','url'], data);
        if ( thumbname ){
            let thumbparts = thumbname.split('/');
            thumbparts.pop();
            thumbname = thumbparts.join('/');
            thumbname += ('/'+size+'px-'+photoname);
            console.log(thumbname);
            $('#wikidata_img').attr('src', thumbname);
        }
    })
    .fail(function() {
        console.log( "error" );
    });


}

function get_first_upper(value){
    if (typeof value === 'string' || value instanceof String)
        value = value.charAt(0).toUpperCase() + value.slice(1);
    return value;
}

function get_json_value(json_key, data){
    try{
        while ( json_key.length>1 ){
            data = data[ json_key[0]]
            json_key = json_key.slice(1);
        }
        return data[json_key[0]];
    } catch(err){
        console.error(err, json_key, JSON.stringify(data));
    }
    return null; //on error
}

get_wikidatum(wikidatum);
