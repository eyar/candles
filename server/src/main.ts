import {connectToDbAndWriteData} from './data-services/database.service';
import {startWSServer} from './websocket-server';

connectToDbAndWriteData()

startWSServer()
