export class HttpUtils {
   /**
    * Helper method to download resources without opening a new browser window
    * @param url Url to fetch
    */
   public static download(url: string) {
    if (url === null || url === undefined || url.length === 0) {
        return;
    }
    window.open(url);
   }

}
