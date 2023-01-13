export const API_URL = 'http://188.225.27.34:3001/api';

type AuthCookie = {
  email: string;
  token: string;
};

export const checkAuth = async (cookie?: AuthCookie) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: cookie && `email=${cookie.email}; token=${cookie.token}`,
      },
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else return { error: 'Wrong answer' };
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

export const login = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const signup = async (signupData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const uploadPhoto = async (photo, userId) => {
  try {
    const response = await fetch(`${API_URL}/signup/${userId}`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Transfer-Encoding': 'base64',
      },
      body: photo,
    });
    const resData = await response.json();

    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserInfoFromServer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const resData = await response.json();

    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const checkFriendRequestStatus = async (initiatorId, targetId) => {
  try {
    const response = await fetch(
      `${API_URL}/friend-request?initiatorId=${initiatorId}&targetId=${targetId}`,
      {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // body: JSON.stringify({ initiatorId, targetId }),
      }
    );
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const addToFriendsHandler = async (initiatorId, targetId) => {
  try {
    const response = await fetch(`${API_URL}/friend-request`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ initiatorId, targetId }),
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const updateFriendRequest = async (initiatorId, targetId, status) => {
  try {
    const response = await fetch(`${API_URL}/friend-request`, {
      method: 'PUT',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ initiatorId, targetId, status }),
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const findRequests = async (userId) => {
  try {
    const response = await fetch(
      `${API_URL}/friend-request/requests/${userId}`,
      {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // body: JSON.stringify({ initiatorId, targetId }),
      }
    );
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const findFriends = async (userId) => {
  try {
    const response = await fetch(
      `${API_URL}/friend-request/friends/${userId}`,
      {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // body: JSON.stringify({ initiatorId, targetId }),
      }
    );
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};

export const getUsersByIds = async (idxs: string) => {
  try {
    const response = await fetch(`${API_URL}/users?idxs=${idxs}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const resData = await response.json();
    if (resData.response) {
      return resData.response;
    } else {
      return { error: 'Wrong answer' };
    }
  } catch (error) {
    return { error: error.message };
  }
};
