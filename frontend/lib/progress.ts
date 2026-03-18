import apiClient from "./apiClient";
import debounce from "lodash.debounce";

export const getVideoProgress = async (videoId: string) => {
  const response = await apiClient.get(`/api/progress/videos/${videoId}`);
  return response.data;
};

const updateProgressApi = async (videoId: string, positionSeconds: number, isCompleted: boolean) => {
  await apiClient.post(`/api/progress/videos/${videoId}`, {
    last_position_seconds: Math.floor(positionSeconds),
    is_completed: isCompleted,
  });
};

const debouncedUpdate = debounce(updateProgressApi, 3000);

export const updateProgress = (videoId: string, positionSeconds: number, isCompleted: boolean) => {
  if (isCompleted) {
    debouncedUpdate.cancel();
    return updateProgressApi(videoId, positionSeconds, isCompleted);
  }
  return debouncedUpdate(videoId, positionSeconds, isCompleted);
};
