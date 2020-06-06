
# How to generate type volume map

**Motivation**

  * I want to display volume data in `assets view`
  * In addition, I want to be able to obtain packaged volume and capacity values

**Solution for realize**

  + At first, I tried to automatically generate the typescript code that becomes data by  
  processing with node javascript from SDE database.  
  however I don't know which table of SDE database should get the necessary data at that time.  
  Finally I decided to get it with ESI request
    * endpoint: `/universe/types/`, `/universe/types/{type_id}/`  
      `/universe/types/{type_id}/` is can obtain **volume**, **packaged_volume**, **capacity**

    * Later, it became clear from which table of SDE database the necessary data  
    could be retrieved, but the latest data was reflected in the ESI data server,  
    so the code to get data from SDE database was not written (2019/10/20)

## code generation approach, etc.

### 1. ESI request

  * Get all EVE typeId by ESI request and throw request for each typeId to get **volume**, **packaged_volume**, **capacity** values
    + endpoint: `/universe/types/`, `/universe/types/{type_id}/`

    Sending all typeId requests at once will put a load on the ESI server,  
    so send it at intervals of several hundred ms in 150 units.  
    In fact, I tried to send it at once, but remember that so many errors occurred

  + The result of this process is output as `resources/raw-type-volume-map.js`.

  ```js
// structure of `resources/raw-type-volume-map.js`
// <typeId>: "volume,packaged_volume,capacity"
/** @type {Record<number, string>} */
const TypeVolumeMap = {
    0: "0,0,0",
    2: "0,0,0",
    3: "1,1,0",
    4: "1,1,0",
    // ...
    14: "1,1,0",
    15: "1,1,0",
    16: "10000000,10000000,0",
    17: "100000000,100000000,0",
    // ...
    22: "16,16,0",
    23: "27500,27500,27500",
    // ...
};
  ```
  + more detail see `etc/scripts/atomic-type-volume-map-gen.js`

### 2. Generate typescript `type-volume-map.ts`

  + While the typeId is unique, each value of volume is associated with multiple types,  
    so devise the data structure.
    * &lt;volume|packaged_volume|capacity>: [&lt;typeId>, &lt;typeId>, &lt;typeId>, ...]
    * By adopting this structure, the source code size that would exceed 1MB **can be reduced to about 250KB**.

```ts
/** volume data */
const vdata: Record<number, number[]>;

/** packaged volume data */
const pvdata: Record<number, number[]>;

/** capacity data */
const capdata: Record<number, number[]>;
```

  + and typescript code is generated with a function to lookup each volume value from typeId.
    + -> `src/eve/models/type-volume-map.ts`

  + These processes are handled by node javascript
    + > node ./resources/eve-tool -cmd type-volume
    + for more details see `resources/eve-tool.js#transfromTypeVoluemMap`
