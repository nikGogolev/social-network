export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://188.225.27.34:3001/api'
    : 'http://localhost:3001/api';

type AuthCookie = {
  email: string;
  token: string;
};

const buildAuthHeaders = (cookie?: AuthCookie) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (cookie?.email && cookie?.token) {
    headers.Cookie = `email=${encodeURIComponent(
      cookie.email
    )}; token=${encodeURIComponent(cookie.token)}`;
  }
  return headers;
};

export const checkAuth = async (cookie?: AuthCookie) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'include',
      headers: buildAuthHeaders(cookie),
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

export const getUsersByIds = async (idxs: string | Array<string | number>) => {
  try {
    const idxsParam = Array.isArray(idxs) ? idxs.join(',') : idxs;
    const response = await fetch(`${API_URL}/users?idxs=${idxsParam}`, {
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

export const findMessages = async (userId) => {
  try {
    const response = await fetch(
      `${API_URL}/messages?id=${userId}&offset=0&count=5`,
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
