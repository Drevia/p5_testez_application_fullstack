package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    SessionRepository sessionRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    SessionService sessionService;

    @Test
    void createSessionOk() {
        Session session = createSessionForTest();
        
        when(sessionRepository.save(any())).thenReturn(session);
        assertDoesNotThrow(() -> sessionService.create(session));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void deleteSessionOk() {
        Long sessionId = 1L;

        assertDoesNotThrow(() -> sessionService.delete(sessionId));
        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    void findAllSessionOk(){
        List<Session> sessions = new ArrayList<>();
        sessions.add(createSessionForTest());
        when(sessionRepository.findAll()).thenReturn(sessions);
        List<Session> result = assertDoesNotThrow(() -> sessionService.findAll());
        verify(sessionRepository, times(1)).findAll();
        assertEquals(sessions.size(), result.size());
        assertEquals(sessions.get(0).getId(), result.get(0).getId());
    }

    @Test
    void findSessionByIdOk(){
        Session session = createSessionForTest();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        Session result = assertDoesNotThrow(() -> sessionService.getById(1L));
        verify(sessionRepository, times(1)).findById(1L);
        assertEquals(session.getId(), result.getId());
    }

    @Test
    void updateSessionOk(){
        Session session = createSessionForTest();
        when(sessionRepository.save(any())).thenReturn(session);
        Session result = assertDoesNotThrow(() -> sessionService.update(2L, session));
        verify(sessionRepository, times(1)).save(session);
        assertEquals(2L, result.getId());
    }

    @Test
    void participateSessionOk(){
        Session session = createSessionForTest();
        User user = createUserForTest();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any())).thenReturn(session);
        assertDoesNotThrow(() -> sessionService.participate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
        assertEquals(1L, session.getUsers().get(0).getId());
    }

    @Test
    void participateSessionUserAlreadyParticipate(){
        Session session = createSessionForTest();
        User user = createUserForTest();
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void participateSessionUserNotFound(){
        Session session = createSessionForTest();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void noLongerParticipateSessionOk(){
        Session session = createSessionForTest();
        User user = createUserForTest();
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any())).thenReturn(session);
        assertDoesNotThrow(() -> sessionService.noLongerParticipate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
        assertEquals(0, session.getUsers().size());
    }

    @Test
    void noLongerParticipateSessionUserNotParticipate(){
        Session session = createSessionForTest();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void noLongerParticipateSessionNotFound(){
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(0)).save(any());
    }

    private Session createSessionForTest() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Session Test");
        session.setDescription("Description Test");
        session.setUsers(new ArrayList<>());
        return session;
    }

    private User createUserForTest() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@email.com");
        return user;
    }
}
